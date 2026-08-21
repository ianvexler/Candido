class Session < ApplicationRecord
  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  scope :active, -> { where(arel_table[:expires_at].gt(Time.current)) }

  def self.issue_for!(user)
    create!(
      user: user,
      token: SecureRandom.hex(32),
      expires_at: 30.days.from_now
    ).tap { user.update!(last_login_at: Time.current) }
  end
end
