# == Schema Information
#
# Table name: JobBoardEntryNotes
#
#  id              :integer          not null, primary key
#  content         :text             not null
#  createdAt       :datetime         not null
#  jobBoardEntryId :integer          not null
#  updatedAt       :datetime         not null
#  userId          :integer          not null
#
# Indexes
#
#  JobBoardEntryNotes_userId_jobBoardEntryId_idx  (userId,jobBoardEntryId)
#
# Foreign Keys
#
#  JobBoardEntryNotes_jobBoardEntryId_fkey  (jobBoardEntryId => JobBoardEntry.id) ON DELETE => restrict ON UPDATE => cascade
#  JobBoardEntryNotes_userId_fkey           (userId => User.id) ON DELETE => restrict ON UPDATE => cascade
#
class JobBoardEntryNote < ApplicationRecord
  include PrismaRecord

  use_prisma_table "JobBoardEntryNotes"
  prisma_aliases(
    user_id: :userId,
    job_board_entry_id: :jobBoardEntryId,
    created_at: :createdAt,
    updated_at: :updatedAt
  )

  belongs_to :user, foreign_key: "userId"
  belongs_to :job_board_entry, foreign_key: "jobBoardEntryId"

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
