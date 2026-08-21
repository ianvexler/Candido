class JobBoardEntryNote < ApplicationRecord
  belongs_to :user
  belongs_to :job_board_entry

  validates :content, presence: true

  def self.find_owned!(user, id)
    note = find_by(id: id)
    raise ApiError.new("Note not found", status: :not_found) if note.nil?
    if note.user_id != user.id
      raise ApiError.new("You are not authorized to access this note", status: :forbidden)
    end

    note
  end
end
