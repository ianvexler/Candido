require "rails_helper"

RSpec.describe "Users" do
  describe "PUT /api/v1/users" do
    it "updates setup_completed for the current user" do
      user = create(:user, setup_completed: false)

      put "/api/v1/users",
        params: { setup_completed: true },
        headers: auth_headers(user),
        as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["user"]).to include("setup_completed" => true, "email" => user.email)
      expect(response.parsed_body["user"]).not_to have_key("password")
      expect(user.reload).to be_setup_completed
    end
  end

  describe "GET /api/v1/users" do
    it "returns users with job board counts for admins" do
      admin = create(:user, :admin)
      member = create(:user)
      create(:job_board_entry, user: member, number: 1)
      create(:job_board_entry, user: member, number: 2)

      get "/api/v1/users", headers: auth_headers(admin)

      expect(response).to have_http_status(:ok)
      listed = response.parsed_body["users"].find { |item| item["id"] == member.id }
      expect(listed["job_board_entries_count"]).to eq(2)
      expect(listed).not_to have_key("password")
    end

    it "forbids non-admins" do
      get "/api/v1/users", headers: auth_headers(create(:user))

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq("error" => "You are not authorized to access this resource")
    end
  end
end
