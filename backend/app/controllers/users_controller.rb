class UsersController < ApplicationController
  before_action :require_authentication
  before_action :require_admin, only: :index

  def index
    render json: {
      users: serialize(
        User.all,
        with: UserBlueprint,
        entry_counts: JobBoardEntry.group(:userId).count
      )
    }
  end

  def update
    current_user.update!(user_params)
    render json: { user: serialize(current_user, with: UserBlueprint) }
  end

  private

  def user_params
    params.permit(:setup_completed)
  end
end
