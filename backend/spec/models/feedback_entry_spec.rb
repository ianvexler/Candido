require "rails_helper"
RSpec.describe FeedbackEntry do
  it "stores type and status values" do
    entry = create(:feedback_entry, type: "BUG", status: "REVIEWED")

    expect(entry.type).to eq("BUG")
    expect(entry.status).to eq("REVIEWED")
    expect(entry.as_json).to include("type" => "BUG", "status" => "REVIEWED")
  end
end
