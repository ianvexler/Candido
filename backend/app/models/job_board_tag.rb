class JobBoardTag < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :job_board_entries

  validates :name, presence: true, uniqueness: { scope: :user_id }

  def self.find_or_create_named!(user, names)
    names.map { |name| name.to_s.strip }.compact_blank.map do |name|
      user.job_board_tags.find_or_create_by!(name: name)
    end
  end
end
