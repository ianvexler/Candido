require "rails_helper"

RSpec.describe "Sessions" do
  describe "POST /api/v1/sessions" do
    it "logs in a verified user and sets the auth cookie" do
      user = create(:user, password: "secret123")

      post "/api/v1/sessions", params: { email: user.email, password: "secret123" }, as: :json

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["user"]).to include(
        "id" => user.id,
        "email" => user.email,
        "setup_completed" => false,
        "admin" => false
      )
      expect(response.parsed_body["user"]).not_to have_key("password")
      expect(response.parsed_body["user"]).not_to have_key("verification_token")
      expect(response.parsed_body["user"]).not_to have_key("job_board_entries_count")
      expect(response.parsed_body["token"]).to be_present
      expect(response.parsed_body["expires_at"]).to be_present
      expect(response.cookies["auth_token"]).to eq(response.parsed_body["token"])
    end

    it "rejects unverified users" do
      user = create(:user, :unverified, password: "secret123")

      post "/api/v1/sessions", params: { email: user.email, password: "secret123" }, as: :json

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq("error" => "Please verify your email before signing in")
    end

    it "rejects invalid credentials" do
      user = create(:user, password: "secret123")

      post "/api/v1/sessions", params: { email: user.email, password: "wrong" }, as: :json

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).to eq("error" => "Invalid email or password")
    end

    it "requires email and password" do
      post "/api/v1/sessions", params: { email: "a@b.com" }, as: :json

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "Email and password are required")
    end
  end

  describe "POST /api/v1/sessions/register" do
    it "creates an unverified user and sends a verification email" do
      expect do
        post "/api/v1/sessions/register",
          params: { email: "new@example.com", password: "secret123", name: "Ada" },
          as: :json
      end.to change(User, :count).by(1).and change { ActionMailer::Base.deliveries.size }.by(1)

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["message"]).to eq("Please check your email to verify your account")
      expect(response.parsed_body["user"]).to include("email" => "new@example.com", "name" => "Ada")
      expect(response.parsed_body["user"]).not_to have_key("verification_token")
      expect(response.cookies["auth_token"]).to be_blank

      user = User.find_by!(email: "new@example.com")
      expect(user).not_to be_verified
      expect(ActionMailer::Base.deliveries.last.to).to eq([ "new@example.com" ])
      expect(ActionMailer::Base.deliveries.last.body.encoded).to include(user.verification_url)
    end

    it "rejects a duplicate email" do
      create(:user, email: "taken@example.com")

      post "/api/v1/sessions/register",
        params: { email: "taken@example.com", password: "secret123", name: "Ada" },
        as: :json

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "User already exists")
    end
  end

  describe "GET /api/v1/sessions/verify" do
    it "verifies a valid token" do
      user = create(:user, :unverified)

      get "/api/v1/sessions/verify", params: { token: user.verification_token }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["message"]).to eq("Email verified successfully")
      expect(user.reload).to be_verified
      expect(user.verification_token).to be_nil
    end

    it "rejects an expired token" do
      user = create(:user, :unverified, verification_expires_at: 1.hour.ago)

      get "/api/v1/sessions/verify", params: { token: user.verification_token }

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "Verification link has expired")
    end

    it "rejects a missing token" do
      get "/api/v1/sessions/verify"

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "Verification token is required")
    end
  end

  describe "GET /api/v1/sessions/me" do
    it "returns the current user from the auth cookie" do
      user = create(:user)
      session_record = create(:session, user: user)

      get "/api/v1/sessions/me", headers: { "Cookie" => "auth_token=#{session_record.token}" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]).to include("id" => user.id, "email" => user.email)
    end

    it "rejects a missing token" do
      get "/api/v1/sessions/me"

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).to eq("error" => "Not authenticated")
    end
  end

  describe "DELETE /api/v1/sessions" do
    it "destroys the session and clears the cookie" do
      user = create(:user)
      session_record = create(:session, user: user)

      delete "/api/v1/sessions", headers: { "Cookie" => "auth_token=#{session_record.token}" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq("message" => "Logged out successfully")
      expect(Session.find_by(id: session_record.id)).to be_nil
    end
  end
end
