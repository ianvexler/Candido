# == Schema Information
#
# Table name: FeedbackEntry
#
#  id        :integer          not null, primary key
#  content   :text             not null
#  createdAt :datetime         not null
#  status    :enum             default("PENDING"), not null
#  title     :text             not null
#  type      :enum             default("OTHER"), not null
#  updatedAt :datetime         not null
#  userId    :integer          not null
#
# Foreign Keys
#
#  FeedbackEntry_userId_fkey  (userId => User.id) ON DELETE => restrict ON UPDATE => cascade
#
class FeedbackEntry < ApplicationRecord
  include PrismaRecord

  TYPES = %w[BUG SUGGESTION OTHER].freeze
  STATUSES = %w[PENDING REVIEWED IMPLEMENTED CLOSED].freeze

  self.inheritance_column = nil

  use_prisma_table "FeedbackEntry"
  prisma_aliases(
    user_id: :userId,
    created_at: :createdAt,
    updated_at: :updatedAt
  )

  belongs_to :user, foreign_key: "userId"

  enum :type, TYPES.index_by(&:itself), default: "OTHER", validate: true
  enum :status, STATUSES.index_by(&:itself), default: "PENDING", validate: true

  validates :title, :content, presence: true
end
