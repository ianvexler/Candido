FactoryBot.define do
  factory :session do
    user
    token { SecureRandom.hex(32) }
    expires_at { 30.days.from_now }
  end
end
