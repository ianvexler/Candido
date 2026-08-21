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

  it "authenticates Node bcrypt $2b$ hashes" do
    user = create(:user, password: "temporary")
    digest = BCrypt::Password.create("secret123", cost: 10).to_s.sub("$2a$", "$2b$")
    user.update_column(:password_digest, digest)

    expect(described_class.authenticate_for_login!(user.email, "secret123")).to eq(user)
    expect { described_class.authenticate_for_login!(user.email, "wrong") }.to raise_error(ApiError)
  end
end
