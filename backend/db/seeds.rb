user = User.find_or_initialize_by(email: "ianvexler@gmail.com")
user.assign_attributes(
  name: "Ian Vexler",
  verified: true,
  setup_completed: false
)
user.password = "password" if user.new_record? || user.password_digest.blank?
user.save!

if user.job_board_entries.exists? && ENV["FORCE_SEED"] != "1"
  puts "Skipping board seed; #{user.email} already has entries. Set FORCE_SEED=1 to replace them."
else
  user.job_board_entries.destroy_all
  user.job_board_tags.destroy_all

  entries_data = [
    { title: "Software Engineer", company: "Google", status: "PENDING", number: 1, location: "Mountain View", salary: "$180k–$250k" },
    { title: "Product Manager", company: "Microsoft", status: "PENDING", number: 2 },
    { title: "Data Scientist", company: "Stripe", status: "PENDING", number: 3, location: "San Francisco", salary: "$150k–$220k" },
    { title: "Frontend Developer", company: "Vercel", status: "PENDING", number: 4, location: "Remote" },
    { title: "DevOps Engineer", company: "AWS", status: "PENDING", number: 5, salary: "$130k–$170k" },
    { title: "Backend Engineer", company: "Spotify", status: "APPLIED", number: 1, location: "New York", salary: "$140k–$190k" },
    { title: "Full Stack Developer", company: "Notion", status: "APPLIED", number: 2 },
    { title: "UX Designer", company: "Figma", status: "APPLIED", number: 3, location: "San Francisco", salary: "$120k–$160k" },
    { title: "Security Engineer", company: "Cloudflare", status: "ASSESSMENT", number: 1, location: "Austin", salary: "$150k–$200k" },
    { title: "Mobile Engineer", company: "Linear", status: "ASSESSMENT", number: 2 },
    { title: "Staff Engineer", company: "Netflix", status: "INTERVIEW", number: 1, location: "Los Gatos", salary: "$200k+" },
    { title: "Engineering Manager", company: "Meta", status: "INTERVIEW", number: 2, salary: "$180k–$250k" },
    { title: "Technical Lead", company: "Airbnb", status: "OFFERED", number: 1, location: "San Francisco" },
    { title: "Platform Engineer", company: "GitHub", status: "ACCEPTED", number: 1, location: "Remote", salary: "$160k–$210k" },
    { title: "Solutions Architect", company: "Salesforce", status: "REJECTED", number: 1 },
    { title: "QA Engineer", company: "Atlassian", status: "REJECTED", number: 2, location: "Sydney", salary: "$110k–$145k" },
    { title: "Site Reliability Engineer", company: "Datadog", status: "ARCHIVED", number: 1, location: "New York", salary: "$155k–$195k" }
  ]

  entries_data.each do |attrs|
    user.job_board_entries.create!(attrs)
  end

  %w[Remote Hybrid On-site TypeScript Python Go React Startup Enterprise Full-time Contract Senior].each do |name|
    user.job_board_tags.create!(name: name)
  end

  entries = user.job_board_entries.order(:id).to_a
  tags = user.job_board_tags.order(:id).to_a

  entries.each do |entry|
    entry.job_board_tags = tags.sample(rand(1..4))
  end

  puts "Seeded #{user.email} with #{user.job_board_entries.count} entries and #{user.job_board_tags.count} tags"
end
