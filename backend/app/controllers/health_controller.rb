class HealthController < ApplicationController
  def show
    render json: {
      status: "healthy",
      timestamp: Time.current.iso8601,
      version: ENV["APP_VERSION"] || `git rev-parse --short HEAD 2>/dev/null`.strip || "unknown",
      environment: Rails.env,
      database: database_status,
      services: service_status
    }
  end

  private

  def database_status
    ActiveRecord::Base.connection.execute("SELECT 1")
    "connected"
  rescue StandardError => e
    Rails.logger.error "Database health check failed: #{e.message}"
    "disconnected"
  end

  def service_status
    {
      redis: redis_status
      # Add other service checks here
    }
  end

  def redis_status
    # Add Redis health check if using Redis
    return "not_configured" unless defined?(Redis)

    Redis.current.ping
    "connected"
  rescue StandardError
    "disconnected"
  end
end
