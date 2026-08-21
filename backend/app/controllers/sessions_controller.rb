class SessionsController < ApplicationController
  wrap_parameters false

  def create
    email = credential(:email)
    password = credential(:password)
    raise ApiError.new("Email and password are required", status: :bad_request) if email.blank? || password.blank?

    user = User.authenticate_for_login!(email, password)
    session_record = Session.issue_for!(user)
    set_auth_cookie(session_record)

    render json: {
      user: serialize(user, with: UserBlueprint),
      token: session_record.token,
      expires_at: session_record.expires_at
    }, status: :created
  end

  def register
    email = credential(:email)
    password = credential(:password)
    name = credential(:name)
    if email.blank? || password.blank? || name.blank?
      raise ApiError.new("Email, password and name are required", status: :bad_request)
    end

    user = User.register!(email: email, password: password, name: name)
    UserMailer.verification_email(user).deliver_now

    render json: {
      user: serialize(user, with: UserBlueprint),
      message: "Please check your email to verify your account"
    }, status: :created
  end

  def verify
    token = params[:token]
    raise ApiError.new("Verification token is required", status: :bad_request) if token.blank?

    user = User.verify_email!(token)
    render json: {
      user: serialize(user, with: UserBlueprint),
      message: "Email verified successfully"
    }
  end

  def me
    require_authentication
    current_user.update!(last_login_at: Time.current)
    render json: { user: serialize(current_user, with: UserBlueprint) }
  end

  def destroy
    require_authentication
    Session.find_by(token: auth_token)&.destroy!
    clear_auth_cookie
    render json: { message: "Logged out successfully" }
  end

  private

  def credential(key)
    raw = request.request_parameters
    value = raw[key.to_s].presence || raw[key].presence || params[key]
    return value.to_s.strip if key == :email || key == :name

    value
  end
end
