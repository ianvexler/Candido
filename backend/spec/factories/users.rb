FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { "Test User" }
    password { "password" }
    verified { true }

    trait :unverified do
      verified { false }
      verification_token { SecureRandom.hex(32) }
      verification_expires_at { 1.day.from_now }
    end

    trait :admin do
      admin { true }
    end
  end
end
