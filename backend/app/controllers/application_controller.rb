class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Authenticatable

  rescue_from ApiError, with: :render_api_error
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  private

  def serialize(object, with:, **options)
    with.render_as_hash(object, options)
  end

  def render_api_error(error)
    render json: { error: error.message }, status: error.status
  end

  def render_not_found(error)
    render json: { error: error.message }, status: :not_found
  end

  def render_unprocessable(error)
    render json: { error: error.record.errors.full_messages.to_sentence }, status: :unprocessable_content
  end

  def render_bad_request(error)
    render json: { error: error.message }, status: :bad_request
  end
end
