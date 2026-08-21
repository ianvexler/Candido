require "rails_helper"
RSpec.describe User do
  it "requires a unique email" do
    create(:user, email: "taken@example.com")
    duplicate = build(:user, email: "taken@example.com")

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:email]).to be_present
  end

  it "authenticates with has_secure_password" do
    user = create(:user, password: "secret123")

    expect(user.authenticate("secret123")).to eq(user)
    expect(user.authenticate("wrong")).to be_falsey
  end
end
