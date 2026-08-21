class UploadsController < ApplicationController
  before_action :require_authentication

  def show
    filename = params[:filename]
    raise ApiError.new("Filename is required", status: :bad_request) if filename.blank?

    uploaded = PdfUploader.open(filename)
    raise ApiError.new("File not found", status: :not_found) if uploaded.nil?

    send_data uploaded.read,
      type: PdfUploader::CONTENT_TYPE,
      disposition: "attachment",
      filename: File.basename(filename)
  end
end
