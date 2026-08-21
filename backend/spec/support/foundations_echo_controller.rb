class FoundationsEchoController < ApplicationController
  def create
    render json: {
      user_id: params[:user_id],
      setup_completed: params[:setup_completed]
    }
  end

  def me
    require_authentication
    render json: { user_id: current_user.id }
  end

  def admin
    require_admin
    render json: { ok: true }
  end
end
