require "shrine"

if Rails.env.test?
  require "shrine/storage/memory"

  Shrine.storages = {
    cache: Shrine::Storage::Memory.new,
    store: Shrine::Storage::Memory.new
  }
elsif ENV["AWS_BUCKET_NAME"].present?
  require "shrine/storage/s3"

  s3_options = {
    bucket: ENV["AWS_BUCKET_NAME"],
    region: ENV.fetch("AWS_REGION", "us-east-1"),
    upload_options: { content_type: "application/pdf" }
  }

  Shrine.storages = {
    cache: Shrine::Storage::S3.new(prefix: "cache", **s3_options),
    store: Shrine::Storage::S3.new(**s3_options)
  }
else
  require "shrine/storage/file_system"

  Shrine.storages = {
    cache: Shrine::Storage::FileSystem.new("tmp", prefix: "uploads/cache"),
    store: Shrine::Storage::FileSystem.new("storage", prefix: "uploads")
  }
end

Shrine.plugin :instrumentation, notifications: ActiveSupport::Notifications unless Rails.env.test?
