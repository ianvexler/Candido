module Authenticatable
  extend ActiveSupport::Concern

  AUTH_COOKIE = "auth_token".freeze

  private

  def current_user
    @current_user ||= find_current_user
  end

  def require_authentication
    raise ApiError.new("Not authenticated", status: :unauthorized) if auth_token.blank?
    raise ApiError.new("Invalid or expired session", status: :unauthorized) if current_user.nil?
  end

  def require_admin
    require_authentication
    return if current_user.admin?

    raise ApiError.new("You are not authorized to access this resource", status: :forbidden)
  end

  def auth_token
    @auth_token ||= bearer_token.presence || cookies[AUTH_COOKIE].presence
  end

  def set_auth_cookie(session_record)
    cookies[AUTH_COOKIE] = auth_cookie_options.merge(
      value: session_record.token,
      expires: session_record.expires_at
    )
  end

  def clear_auth_cookie
    cookies.delete(AUTH_COOKIE, **auth_cookie_options.slice(:path, :domain))
  end

  def auth_cookie_options
    options = {
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      path: "/"
    }
    options[:domain] = :all if Rails.env.production?
    options
  end

  def bearer_token
    request.headers["Authorization"]&.delete_prefix("Bearer ")
  end

  def find_current_user
    return if auth_token.blank?

    session = Session.find_by(token: auth_token)
    return if session.nil? || session.expires_at <= Time.current

    session.user
  end
end
