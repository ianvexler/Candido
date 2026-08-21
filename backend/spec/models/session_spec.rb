require "rails_helper"
RSpec.describe Session do
  it "requires a unique token" do
    create(:session, token: "abc123")
    duplicate = build(:session, token: "abc123")

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:token]).to be_present
  end
end
