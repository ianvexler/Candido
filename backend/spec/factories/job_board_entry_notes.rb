FactoryBot.define do
  factory :job_board_entry_note do
    job_board_entry
    user { job_board_entry.user }
    content { "Follow up next week." }
  end
end
