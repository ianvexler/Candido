require "rails_helper"

RSpec.describe "Notes" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:entry) { create(:job_board_entry, user: user, number: 1) }

  describe "GET /api/v1/notes/:job_board_entry_id" do
    it "returns notes for an owned entry" do
      note = create(:job_board_entry_note, job_board_entry: entry, user: user, content: "Follow up")
      create(:job_board_entry_note, content: "Other user")

      get "/api/v1/notes/#{entry.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["notes"].map { |item| item["id"] }).to eq([ note.id ])
      expect(response.parsed_body["notes"].first).to include("content" => "Follow up", "user_id" => user.id)
    end

    it "forbids another user's entry" do
      other = create(:job_board_entry, number: 1)

      get "/api/v1/notes/#{other.id}", headers: headers

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "POST /api/v1/notes" do
    it "creates a note on an owned entry" do
      post "/api/v1/notes",
        params: { job_board_entry_id: entry.id, content: "Prep questions" },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["note"]).to include(
        "content" => "Prep questions",
        "job_board_entry_id" => entry.id,
        "user_id" => user.id
      )
    end
  end

  describe "PUT /api/v1/notes/:id" do
    it "updates an owned note" do
      note = create(:job_board_entry_note, job_board_entry: entry, user: user, content: "Old")

      put "/api/v1/notes/#{note.id}",
        params: { content: "New" },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["note"]["content"]).to eq("New")
      expect(note.reload.content).to eq("New")
    end
  end

  describe "DELETE /api/v1/notes/:id" do
    it "deletes an owned note" do
      note = create(:job_board_entry_note, job_board_entry: entry, user: user)

      delete "/api/v1/notes/#{note.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["note"]["id"]).to eq(note.id)
      expect(JobBoardEntryNote.find_by(id: note.id)).to be_nil
    end
  end
end
