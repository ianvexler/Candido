class FeedbackEntriesController < ApplicationController
  before_action :require_authentication
  before_action :require_admin, only: :index

  def index
    entries = FeedbackEntry.includes(:user).order(createdAt: :desc)
    render json: { feedback_entries: serialize(entries, with: FeedbackEntryBlueprint) }
  end

  def create
    entry = current_user.feedback_entries.create!(feedback_entry_params)
    UserMailer.new_feedback_email(entry).deliver_now
    render json: { feedback_entry: serialize(entry, with: FeedbackEntryBlueprint) }
  end

  private

  def feedback_entry_params
    params.permit(:title, :content, :type)
  end
end
