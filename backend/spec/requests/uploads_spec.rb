require "rails_helper"

RSpec.describe "Uploads" do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }

  after { clear_shrine_storage }

  describe "GET /uploads/:filename" do
    it "requires authentication" do
      get "/uploads/missing.pdf"

      expect(response).to have_http_status(:unauthorized)
    end

    it "returns 404 when the file is missing" do
      get "/uploads/missing.pdf", headers: headers

      expect(response).to have_http_status(:not_found)
      expect(response.parsed_body).to eq("error" => "File not found")
    end
  end
end
