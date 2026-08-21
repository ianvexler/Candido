require "rails_helper"

RSpec.describe "Health" do
  describe "GET /" do
    it "returns a successful response" do
      get "/"

      expect(response).to be_successful
    end
  end

  describe "GET /up" do
    it "reports that the app has booted" do
      get "/up"

      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /api/v1" do
    it "is reachable without authentication" do
      get "/api/v1"

      expect(response).to have_http_status(:ok)
    end
  end
end
