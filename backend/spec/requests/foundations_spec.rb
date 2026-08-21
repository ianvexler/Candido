require "rails_helper"

RSpec.describe "Foundations" do
  around do |example|
    Rails.application.routes.disable_clear_and_finalize = true
    Rails.application.routes.draw do
      post "/foundations/echo", to: "foundations_echo#create"
      get "/foundations/me", to: "foundations_echo#me"
      get "/foundations/admin", to: "foundations_echo#admin"
    end

    example.run
  ensure
    Rails.application.routes.disable_clear_and_finalize = false
    Rails.application.reload_routes!
  end

  describe "camelCase JSON" do
    it "underscores incoming keys and camelizes the response" do
      post "/foundations/echo",
        params: { userId: 12, setupCompleted: true },
        as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq(
        "userId" => 12,
        "setupCompleted" => true
      )
    end
  end

  describe "authentication" do
    let(:user) { double("User", id: 7, admin?: false) }
    let(:admin) { double("User", id: 1, admin?: true) }

    before do
      session_model = Class.new do
        def self.find_by(**)
        end
      end
      stub_const("Session", session_model)

      allow(session_model).to receive(:find_by) do |**kwargs|
        case kwargs[:token]
        when "valid-token"
          double("SessionRecord", user: user, expires_at: 1.day.from_now)
        when "admin-token"
          double("SessionRecord", user: admin, expires_at: 1.day.from_now)
        when "expired-token"
          double("SessionRecord", user: user, expires_at: 1.minute.ago)
        end
      end
    end

    it "rejects requests without a token" do
      get "/foundations/me"

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).to eq("error" => "Not authenticated")
    end

    it "rejects expired sessions" do
      get "/foundations/me", headers: { "Cookie" => "auth_token=expired-token" }

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body).to eq("error" => "Invalid or expired session")
    end

    it "authenticates via the auth_token cookie" do
      get "/foundations/me", headers: { "Cookie" => "auth_token=valid-token" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq("userId" => 7)
    end

    it "authenticates via a Bearer token" do
      get "/foundations/me", headers: { "Authorization" => "Bearer valid-token" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq("userId" => 7)
    end

    it "rejects non-admins from admin endpoints" do
      get "/foundations/admin", headers: { "Cookie" => "auth_token=valid-token" }

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq("error" => "You are not authorized to access this resource")
    end

    it "allows admins through" do
      get "/foundations/admin", headers: { "Cookie" => "auth_token=admin-token" }

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body).to eq("ok" => true)
    end
  end

  describe "CORS" do
    it "allows credentialed requests from the Next.js origin" do
      process :options, "/",
        headers: {
          "Origin" => "http://localhost:3000",
          "Access-Control-Request-Method" => "GET"
        }

      expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:3000")
      expect(response.headers["Access-Control-Allow-Credentials"]).to eq("true")
    end
  end
end
