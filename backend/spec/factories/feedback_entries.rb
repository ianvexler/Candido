FactoryBot.define do
  factory :feedback_entry do
    user
    title { "Great board" }
    content { "Love the drag and drop." }
    type { "SUGGESTION" }
    status { "PENDING" }
  end
end
