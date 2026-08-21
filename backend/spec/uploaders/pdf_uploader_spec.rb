require "rails_helper"

RSpec.describe PdfUploader do
  after { clear_shrine_storage }

  it "stores and reads a PDF" do
    uploaded = described_class.store!(pdf_upload("resume.pdf"))

    expect(uploaded.id).to end_with(".pdf")
    expect(described_class.open(uploaded.id).read).to start_with("%PDF")
  end

  it "returns nil when the file is missing" do
    expect(described_class.open("missing.pdf")).to be_nil
  end

  it "deletes a stored file" do
    uploaded = described_class.store!(pdf_upload("resume.pdf"))
    described_class.delete_key(uploaded.id)

    expect(described_class.open(uploaded.id)).to be_nil
  end

  it "rejects a non-pdf upload" do
    expect { described_class.store!(text_upload("notes.txt")) }
      .to raise_error(ApiError, "Please upload a valid PDF file")
  end

  it "accepts a .pdf whose content type is not application/pdf" do
    uploaded = described_class.store!(uploaded_file("resume.pdf", "%PDF-1.4\n%%EOF\n", "application/octet-stream"))

    expect(uploaded.id).to end_with(".pdf")
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
