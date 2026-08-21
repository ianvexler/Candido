FactoryBot.define do
  factory :job_board_entry do
    user
    title { "Software Engineer" }
    company { "Acme" }
    sequence(:number) { |n| n }
    status { "PENDING" }
  end
end
