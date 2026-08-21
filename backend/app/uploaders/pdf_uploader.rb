class PdfUploader < Shrine
  MAX_SIZE = 5.megabytes
  CONTENT_TYPE = "application/pdf".freeze

  plugin :validation_helpers
  plugin :determine_mime_type, analyzer: :marcel

  Attacher.validate do
    validate_max_size MAX_SIZE
    validate_extension_inclusion %w[pdf]
  end

  def generate_location(io, metadata: {}, **)
    ext = File.extname(metadata["filename"].to_s).delete_prefix(".").presence || "pdf"
    "#{(Time.now.to_f * 1000).to_i}-#{rand(1_000_000_000)}.#{ext}"
  end

  def self.store!(file)
    attacher = Attacher.new
    attacher.assign(file)
    raise ApiError.new("Please upload a valid PDF file", status: :bad_request) if attacher.errors.any?

    attacher.finalize
    attacher.file
  end

  def self.open(key)
    return if key.blank?

    uploaded = uploaded_file("id" => File.basename(key), "storage" => "store")
    uploaded if uploaded.exists?
  end

  def self.delete_key(key)
    open(key)&.delete
  end
end
