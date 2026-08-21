require "rails_helper"

RSpec.describe "Job board entries" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  describe "GET /api/job-board-entries" do
    it "returns the current user's entries with tags" do
      tag = create(:job_board_tag, user: user, name: "Remote")
      entry = create(:job_board_entry, user: user, title: "Engineer", number: 1)
      entry.job_board_tags << tag
      create(:job_board_entry, title: "Other user job", number: 1)

      get "/api/job-board-entries", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["isEmpty"]).to be(false)
      titles = response.parsed_body["jobBoardEntries"].map { |item| item["title"] }
      expect(titles).to eq([ "Engineer" ])
      expect(response.parsed_body["jobBoardEntries"].first["jobBoardTags"].map { |item| item["name"] })
        .to eq([ "Remote" ])
    end

    it "requires authentication" do
      get "/api/job-board-entries"

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "GET /api/job-board-entries/:id" do
    it "returns an owned entry" do
      entry = create(:job_board_entry, user: user, title: "Engineer", number: 1)

      get "/api/job-board-entries/#{entry.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["jobBoardEntry"]["title"]).to eq("Engineer")
    end

    it "forbids another user's entry" do
      entry = create(:job_board_entry, number: 1)

      get "/api/job-board-entries/#{entry.id}", headers: headers

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body).to eq(
        "error" => "You are not authorized to view this job board entry"
      )
    end
  end

  describe "POST /api/job-board-entries" do
    it "creates an entry with the next number and tags" do
      create(:job_board_entry, user: user, status: "PENDING", number: 1)

      post "/api/job-board-entries",
        params: {
          title: "PM",
          company: "Globex",
          location: "London",
          salary: "80k",
          url: "https://example.com",
          description: "Role",
          status: "PENDING",
          tags: [ "Remote", "  Startup  " ],
          closingDate: "2026-09-01"
        },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["jobBoardEntry"]
      expect(body).to include("title" => "PM", "company" => "Globex", "number" => 2, "status" => "PENDING")
      expect(body["jobBoardTags"].map { |item| item["name"] }).to contain_exactly("Remote", "Startup")
      expect(user.job_board_entries.find_by(title: "PM").closing_date).to be_present
    end
  end

  describe "POST /api/job-board-entries/import" do
    it "imports entries and numbers them per status" do
      post "/api/job-board-entries/import",
        params: {
          entries: [
            { title: "A", company: "Acme", status: "PENDING" },
            { title: "B", company: "Acme", status: "PENDING" },
            { title: "C", company: "Acme", status: "APPLIED" }
          ]
        },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      imported = response.parsed_body["jobBoardEntries"]
      expect(imported.map { |item| [ item["title"], item["status"], item["number"] ] }).to eq(
        [ [ "A", "PENDING", 1 ], [ "B", "PENDING", 2 ], [ "C", "APPLIED", 1 ] ]
      )
    end

    it "rejects an empty entries list" do
      post "/api/job-board-entries/import",
        params: { entries: [] },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq(
        "error" => "Entries array is required and must not be empty"
      )
    end
  end

  describe "PUT /api/job-board-entries/:id" do
    it "updates fields and replaces tags" do
      entry = create(:job_board_entry, user: user, title: "Engineer", number: 1)
      entry.job_board_tags << create(:job_board_tag, user: user, name: "Old")

      put "/api/job-board-entries/#{entry.id}",
        params: {
          title: "Staff Engineer",
          company: "Acme",
          location: "Remote",
          salary: "100k",
          url: "https://example.com",
          description: "Updated",
          status: "PENDING",
          number: 1,
          tagNames: [ "New" ]
        },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["jobBoardEntry"]
      expect(body["title"]).to eq("Staff Engineer")
      expect(body["jobBoardTags"].map { |item| item["name"] }).to eq([ "New" ])
    end

    it "reorders within a status" do
      first = create(:job_board_entry, user: user, title: "First", status: "PENDING", number: 1)
      second = create(:job_board_entry, user: user, title: "Second", status: "PENDING", number: 2)

      put "/api/job-board-entries/#{second.id}",
        params: {
          title: second.title,
          company: second.company,
          status: "PENDING",
          number: 1
        },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      expect(second.reload.number).to eq(1)
      expect(first.reload.number).to eq(2)
    end

    it "moves an entry into another status column" do
      pending_entry = create(:job_board_entry, user: user, title: "Pending", status: "PENDING", number: 1)
      applied = create(:job_board_entry, user: user, title: "Applied", status: "APPLIED", number: 1)

      put "/api/job-board-entries/#{pending_entry.id}",
        params: {
          title: pending_entry.title,
          company: pending_entry.company,
          status: "APPLIED",
          number: 1
        },
        headers: headers,
        as: :json

      expect(response).to have_http_status(:ok)
      expect(pending_entry.reload).to have_attributes(status: "APPLIED", number: 1)
      expect(applied.reload.number).to eq(2)
    end
  end

  describe "DELETE /api/job-board-entries/:id" do
    it "deletes an entry and closes the number gap" do
      first = create(:job_board_entry, user: user, title: "First", number: 1)
      second = create(:job_board_entry, user: user, title: "Second", number: 2)
      third = create(:job_board_entry, user: user, title: "Third", number: 3)

      delete "/api/job-board-entries/#{second.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["jobBoardEntry"]["id"]).to eq(second.id)
      expect(JobBoardEntry.find_by(id: second.id)).to be_nil
      expect(first.reload.number).to eq(1)
      expect(third.reload.number).to eq(2)
    end
  end

  describe "GET /api/job-board-entries/stats" do
    it "returns counts, weekly totals, response rate, and top tags" do
      travel_to Time.utc(2026, 8, 21, 12, 0, 0) do
        create(:job_board_entry, user: user, status: "PENDING", number: 1)
        create(:job_board_entry, user: user, status: "APPLIED", number: 1)
        create(:job_board_entry, user: user, status: "INTERVIEW", number: 1)
        popular = create(:job_board_tag, user: user, name: "Remote")
        other = create(:job_board_tag, user: user, name: "Onsite")
        user.job_board_entries.first.job_board_tags << popular
        user.job_board_entries.second.job_board_tags << popular
        user.job_board_entries.third.job_board_tags << other

        get "/api/job-board-entries/stats", headers: headers

        expect(response).to have_http_status(:ok)
        body = response.parsed_body
        expect(body["counts"]).to include(
          "total" => 3,
          "pending" => 1,
          "applied" => 1,
          "interview" => 1,
          "offered" => 0
        )
        expect(body["thisWeek"]).to eq(3)
        expect(body["lastWeek"]).to eq(0)
        expect(body["responseRate"]).to eq(33)
        expect(body["topTags"].first).to eq("name" => "Remote", "count" => 2)
      end
    end
  end

  describe "POST /api/job-board-entries/:id/cv" do
    after { clear_shrine_storage }

    it "stores PDF text on the entry" do
      entry = create(:job_board_entry, user: user, number: 1)

      post "/api/job-board-entries/#{entry.id}/cv",
        params: { cvText: "Cover of skills" },
        headers: headers

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["jobBoardEntry"]
      expect(body["cvText"]).to eq("Cover of skills")
      expect(body["cvKey"]).to be_nil
      expect(body["cvFilename"]).to be_nil
    end

    it "stores a PDF file and serves it from /uploads" do
      entry = create(:job_board_entry, user: user, number: 1)

      post "/api/job-board-entries/#{entry.id}/cv",
        params: { file: pdf_upload("resume.pdf") },
        headers: headers

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["jobBoardEntry"]
      expect(body["cvFilename"]).to eq("resume.pdf")
      expect(body["cvKey"]).to end_with(".pdf")
      expect(body["cvText"]).to be_nil

      get "/uploads/#{body["cvKey"]}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq("application/pdf")
      expect(response.body).to start_with("%PDF")
    end

    it "rejects a non-pdf file" do
      entry = create(:job_board_entry, user: user, number: 1)

      post "/api/job-board-entries/#{entry.id}/cv",
        params: { file: text_upload("notes.txt") },
        headers: headers

      expect(response).to have_http_status(:bad_request)
      expect(response.parsed_body).to eq("error" => "Please upload a valid PDF file")
    end

    it "clears the CV when neither text nor file is sent" do
      entry = create(:job_board_entry, user: user, number: 1, cv_text: "old")

      post "/api/job-board-entries/#{entry.id}/cv", params: {}, headers: headers

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body["jobBoardEntry"]["cvText"]).to be_nil
    end
  end

  describe "POST /api/job-board-entries/:id/cover-letter" do
    after { clear_shrine_storage }

    it "stores a cover letter PDF" do
      entry = create(:job_board_entry, user: user, number: 1)

      post "/api/job-board-entries/#{entry.id}/cover-letter",
        params: { file: pdf_upload("letter.pdf") },
        headers: headers

      expect(response).to have_http_status(:ok)
      body = response.parsed_body["jobBoardEntry"]
      expect(body["coverLetterFilename"]).to eq("letter.pdf")
      expect(body["coverLetterKey"]).to end_with(".pdf")
    end
  end

  def pdf_upload(name)
    uploaded_file(name, "%PDF-1.4\n%%EOF\n", "application/pdf")
  end

  def text_upload(name)
    uploaded_file(name, "not a pdf", "text/plain")
  end

  def uploaded_file(name, contents, content_type)
    file = Tempfile.new([ File.basename(name, ".*"), File.extname(name) ])
    file.binmode
    file.write(contents)
    file.rewind
    Rack::Test::UploadedFile.new(file.path, content_type, original_filename: name)
  end
end
