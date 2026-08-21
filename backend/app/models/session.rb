# == Schema Information
#
# Table name: Session
#
#  id        :integer          not null, primary key
#  createdAt :datetime         not null
#  expiresAt :datetime         not null
#  token     :text             not null
#  updatedAt :datetime         not null
#  userId    :integer          not null
#
# Indexes
#
#  Session_token_idx   (token)
#  Session_token_key   (token) UNIQUE
#  Session_userId_idx  (userId)
#
# Foreign Keys
#
#  Session_userId_fkey  (userId => User.id) ON DELETE => restrict ON UPDATE => cascade
#
class Session < ApplicationRecord
  include PrismaRecord

  use_prisma_table "Session"
  prisma_aliases(
    user_id: :userId,
    expires_at: :expiresAt,
    created_at: :createdAt,
    updated_at: :updatedAt
  )

  belongs_to :user, foreign_key: "userId"

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  scope :active, -> { where(arel_table[:expiresAt].gt(Time.current)) }

  def self.issue_for!(user)
    create!(
      user: user,
      token: SecureRandom.hex(32),
      expires_at: 30.days.from_now
    ).tap { user.update!(last_login_at: Time.current) }
  end
end
