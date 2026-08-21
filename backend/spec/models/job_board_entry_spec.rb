require "rails_helper"
RSpec.describe JobBoardEntry do
  it "enforces a unique number per user and status" do
    user = create(:user)
    create(:job_board_entry, user: user, status: "PENDING", number: 1)
    duplicate = build(:job_board_entry, user: user, status: "PENDING", number: 1)

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:number]).to be_present
  end

  it "allows the same number in a different status" do
    user = create(:user)
    create(:job_board_entry, user: user, status: "PENDING", number: 1)
    other = build(:job_board_entry, user: user, status: "APPLIED", number: 1)

    expect(other).to be_valid
  end

  it "assigns the next number for a status" do
    user = create(:user)
    create(:job_board_entry, user: user, status: "PENDING", number: 2)

    expect(described_class.next_number_for(user, "PENDING")).to eq(3)
    expect(described_class.next_number_for(user, "APPLIED")).to eq(1)
  end

  it "serializes status as the Prisma uppercase value" do
    entry = create(:job_board_entry, status: "INTERVIEW")

    expect(entry.status).to eq("INTERVIEW")
    expect(entry.as_json["status"]).to eq("INTERVIEW")
  end

  it "finds or creates tags by name for the entry owner" do
    user = create(:user)
    existing = create(:job_board_tag, user: user, name: "Remote")
    entry = create(:job_board_entry, user: user)

    entry.assign_tag_names([ "Remote", "  Startup  ", "" ])

    expect(entry.job_board_tags.map(&:name)).to contain_exactly("Remote", "Startup")
    expect(entry.job_board_tags).to include(existing)
    expect(user.job_board_tags.count).to eq(2)
  end
end
