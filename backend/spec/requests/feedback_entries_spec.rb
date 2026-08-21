require "rails_helper"

RSpec.describe "Feedback entries" do
  describe "POST /api/feedback-entries" do
    it "creates feedback and emails the team" do
      user = create(:user, name: "Ada")

      expect do
        post "/api/feedback-entries",
          params: { title: "Bug", content: "Kanban is stuck", type: "BUG" },
          headers: auth_headers(user),
          as: :json
      end.to change(FeedbackEntry, :count).by(1).and change { ActionMailer::Base.deliveries.size }.by(1)

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["feedbackEntry"]
      expect(body).to include("title" => "Bug", "type" => "BUG", "userId" => user.id)
      expect(body["user"]).to include("email" => user.email)
      expect(body["user"]).not_to have_key("password")

      mail = ActionMailer::Base.deliveries.last
      expect(mail.to).to eq([ "no-reply@candidohq.com" ])
      expect(mail.subject).to eq("New feedback entry")
      expect(mail.body.encoded).to include("Ada", "BUG", "Kanban is stuck")
    end
  end

  describe "GET /api/feedback-entries" do
    it "returns entries for admins newest first" do
      admin = create(:user, :admin)
      older = create(:feedback_entry, title: "Old")
      newer = create(:feedback_entry, title: "New")
      older.update_column(:createdAt, 2.days.ago)
      newer.update_column(:createdAt, 1.hour.ago)

      get "/api/feedback-entries", headers: auth_headers(admin)

      expect(response).to have_http_status(:ok)
      titles = response.parsed_body["feedbackEntries"].map { |item| item["title"] }
      expect(titles).to eq([ "New", "Old" ])
    end

    it "forbids non-admins" do
      get "/api/feedback-entries", headers: auth_headers(create(:user))

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq("error" => "You are not authorized to access this resource")
    end
  end
end
