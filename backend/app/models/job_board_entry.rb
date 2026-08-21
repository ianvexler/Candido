class JobBoardEntry < ApplicationRecord
  STATUSES = %w[PENDING APPLIED ASSESSMENT INTERVIEW OFFERED REJECTED ACCEPTED ARCHIVED].freeze

  belongs_to :user
  has_many :job_board_entry_notes, dependent: :destroy
  has_and_belongs_to_many :job_board_tags

  enum :status, STATUSES.index_by(&:itself), default: "PENDING", validate: true

  validates :title, :company, :number, presence: true
  validates :number, uniqueness: { scope: [ :user_id, :status ] }

  RESPONDED_STATUSES = (STATUSES - %w[PENDING APPLIED ARCHIVED]).freeze

  def self.next_number_for(user, status)
    (where(user: user, status: status).maximum(:number) || 0) + 1
  end

  def self.find_owned!(user, id, unauthorized_message:)
    entry = find_by(id: id)
    raise ApiError.new("Job board entry not found", status: :not_found) if entry.nil?
    if entry.user_id != user.id
      raise ApiError.new(unauthorized_message, status: :forbidden)
    end

    entry
  end

  def self.create_for_user!(user, attributes, tag_names: nil)
    transaction do
      status = attributes[:status].presence || "PENDING"
      entry = user.job_board_entries.create!(attributes.merge(
        status: status,
        number: next_number_for(user, status)
      ))
      entry.assign_tag_names(tag_names)
      entry
    end
  end

  def self.bulk_import_for_user!(user, entries)
    transaction do
      max_by_status = {}
      entries.map do |attributes|
        status = attributes[:status].presence || "PENDING"
        number = max_by_status[status] || next_number_for(user, status)
        max_by_status[status] = number + 1
        user.job_board_entries.create!(
          title: attributes[:title],
          company: attributes[:company],
          location: attributes[:location].presence || "",
          salary: attributes[:salary].presence || "",
          url: attributes[:url].presence || "",
          description: attributes[:description].presence || "",
          status: status,
          number: number
        )
      end
    end
  end

  def self.stats_for(user)
    grouped = where(user: user).group(:status).count
    now = Time.current
    this_week_start = now.beginning_of_week(:monday)
    last_week_start = this_week_start - 1.week
    last_week_end = last_week_start.end_of_week(:monday)
    all_count = grouped.values.sum
    responded = where(user: user).where(status: RESPONDED_STATUSES).count

    {
      counts: {
        total: all_count,
        pending: grouped["PENDING"] || 0,
        applied: grouped["APPLIED"] || 0,
        assessment: grouped["ASSESSMENT"] || 0,
        interview: grouped["INTERVIEW"] || 0,
        offered: grouped["OFFERED"] || 0,
        rejected: grouped["REJECTED"] || 0,
        accepted: grouped["ACCEPTED"] || 0
      },
      this_week: where(user: user).where(created_at: this_week_start..now).count,
      last_week: where(user: user).where(created_at: last_week_start..last_week_end).count,
      response_rate: all_count.zero? ? 0 : ((responded * 100.0) / all_count).round,
      top_tags: top_tags_for(user)
    }
  end

  def self.top_tags_for(user)
    JobBoardTag.where(user: user)
      .left_joins(:job_board_entries)
      .group("job_board_tags.id")
      .order(Arel.sql("COUNT(job_board_entries.id) DESC"))
      .limit(5)
      .pluck("job_board_tags.name", Arel.sql("COUNT(job_board_entries.id)"))
      .map { |name, count| { name: name, count: count } }
  end

  def assign_tag_names(names)
    return if names.nil?

    self.job_board_tags = JobBoardTag.find_or_create_named!(user, names)
  end

  def update_for_user!(attributes, tag_names: nil)
    transaction do
      next_status = attributes.key?(:status) ? attributes[:status] : status
      next_number = attributes.key?(:number) ? attributes[:number].to_i : number
      make_room_for!(next_status, next_number) if next_status != status || next_number != number

      assign_attributes(attributes)
      save!
      assign_tag_names(tag_names)
      self
    end
  end

  def destroy_and_renumber!
    transaction do
      column_status = status
      deleted_number = number
      owner_id = user_id
      destroy!

      self.class.where(user_id: owner_id, status: column_status)
        .where(self.class.arel_table[:number].gt(deleted_number))
        .order(:number)
        .each_with_index { |entry, index| entry.update!(number: deleted_number + index) }
    end
  end

  def upload_cv!(text: nil, file: nil)
    apply_upload!(
      text: text,
      file: file,
      text_attr: :cv_text,
      key_attr: :cv_key,
      filename_attr: :cv_filename
    )
  end

  def upload_cover_letter!(text: nil, file: nil)
    apply_upload!(
      text: text,
      file: file,
      text_attr: :cover_letter_text,
      key_attr: :cover_letter_key,
      filename_attr: :cover_letter_filename
    )
  end

  private

  def apply_upload!(text:, file:, text_attr:, key_attr:, filename_attr:)
    if text.present?
      PdfUploader.delete_key(self[key_attr])
      update!(text_attr => text, key_attr => nil, filename_attr => nil)
    elsif file.present?
      uploaded = PdfUploader.store!(file)
      PdfUploader.delete_key(self[key_attr])
      update!(text_attr => nil, key_attr => uploaded.id, filename_attr => file.original_filename)
    else
      PdfUploader.delete_key(self[key_attr])
      update!(text_attr => nil, key_attr => nil, filename_attr => nil)
    end
  end

  def make_room_for!(next_status, next_number)
    update_column(:number, -1) if next_status == status && next_number != number

    self.class.where(user_id: user_id, status: next_status)
      .where(self.class.arel_table[:number].gteq(next_number))
      .where.not(id: id)
      .order(number: :desc)
      .each { |entry| entry.update_column(:number, entry.number + 1) }
  end
end
