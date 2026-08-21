FactoryBot.define do
  factory :job_board_tag do
    user
    sequence(:name) { |n| "Tag #{n}" }
  end
end
