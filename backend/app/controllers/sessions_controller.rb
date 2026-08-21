class SessionsController < ApplicationController
  def create
    email = params[:email]
    password = params[:password]
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
    email = params[:email]
    password = params[:password]
    name = params[:name]
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
end
