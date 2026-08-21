class User < ApplicationRecord
  has_secure_password

  has_many :sessions, dependent: :destroy
  has_many :job_board_entries, dependent: :destroy
  has_many :job_board_tags, dependent: :destroy
  has_many :job_board_entry_notes, dependent: :destroy
  has_many :feedback_entries, dependent: :destroy

  validates :email, presence: true, uniqueness: true

  def self.authenticate_for_login!(email, password)
    user = find_by(email: email)
    raise ApiError.new("Invalid email or password", status: :unauthorized) if user.nil? || user.password_digest.blank?
    raise ApiError.new("Please verify your email before signing in", status: :forbidden) unless user.verified?
    raise ApiError.new("Invalid email or password", status: :unauthorized) unless user.authenticate(password)

    user.update!(last_login_at: Time.current)
    user
  end

  def self.register!(email:, password:, name:)
    raise ApiError.new("User already exists", status: :bad_request) if exists?(email: email)

    create!(
      email: email,
      password: password,
      name: name,
      verification_token: SecureRandom.hex(32),
      verification_expires_at: 1.day.from_now
    )
  end

  def self.verify_email!(token)
    user = find_by(verification_token: token)
    raise ApiError.new("Invalid or expired verification link", status: :bad_request) if user.nil?
    if user.verification_expires_at.present? && user.verification_expires_at < Time.current
      raise ApiError.new("Verification link has expired", status: :bad_request)
    end

    user.update!(verified: true, verification_token: nil, verification_expires_at: nil)
    user
  end

  def verification_url
    "#{ENV.fetch("CORS_ORIGIN", "http://localhost:3000").chomp("/")}/verify?token=#{verification_token}"
  end
end
