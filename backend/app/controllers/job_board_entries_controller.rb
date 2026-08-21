class JobBoardEntriesController < ApplicationController
  before_action :require_authentication
  before_action :set_job_board_entry, only: %i[show update destroy upload_cv upload_cover_letter]

  UNAUTHORIZED_MESSAGES = {
    show: "You are not authorized to view this job board entry",
    update: "You are not authorized to update this job board entry",
    destroy: "You are not authorized to delete this job board entry",
    upload_cv: "You are not authorized to upload a CV for this job board entry",
    upload_cover_letter: "You are not authorized to upload a cover letter for this job board entry"
  }.freeze

  def index
    entries = current_user.job_board_entries.includes(:job_board_tags)
    render json: {
      job_board_entries: serialize(entries, with: JobBoardEntryBlueprint),
      is_empty: entries.empty?
    }
  end

  def show
    render json: { job_board_entry: serialize(@job_board_entry, with: JobBoardEntryBlueprint) }
  end

  def create
    entry = JobBoardEntry.create_for_user!(current_user, entry_attributes, tag_names: params[:tags])
    render json: { job_board_entry: serialize(entry, with: JobBoardEntryBlueprint) }
  end

  def bulk_import
    entries = params[:entries]
    unless entries.is_a?(Array) && entries.any?
      raise ApiError.new("Entries array is required and must not be empty", status: :bad_request)
    end

    created = JobBoardEntry.bulk_import_for_user!(current_user, import_attributes(entries))
    render json: { job_board_entries: serialize(created, with: JobBoardEntryBlueprint) }
  end

  def update
    @job_board_entry.update_for_user!(entry_attributes, tag_names: params[:tag_names])
    render json: { job_board_entry: serialize(@job_board_entry, with: JobBoardEntryBlueprint) }
  end

  def destroy
    snapshot = serialize(@job_board_entry, with: JobBoardEntryBlueprint)
    @job_board_entry.destroy_and_renumber!
    render json: { job_board_entry: snapshot }
  end

  def stats
    render json: serialize(JobBoardEntry.stats_for(current_user), with: JobBoardEntriesStatsBlueprint)
  end

  def upload_cv
    @job_board_entry.upload_cv!(text: params[:cv_text], file: params[:file])
    render json: { job_board_entry: serialize(@job_board_entry, with: JobBoardEntryBlueprint) }
  end

  def upload_cover_letter
    @job_board_entry.upload_cover_letter!(text: params[:cover_letter_text], file: params[:file])
    render json: { job_board_entry: serialize(@job_board_entry, with: JobBoardEntryBlueprint) }
  end

  private

  def set_job_board_entry
    @job_board_entry = JobBoardEntry.find_owned!(
      current_user,
      params[:id],
      unauthorized_message: UNAUTHORIZED_MESSAGES.fetch(action_name.to_sym)
    )
  end

  def entry_attributes
    permitted = params.permit(
      :title, :company, :location, :salary, :url, :description, :status, :number, :closing_date
    ).to_h.symbolize_keys
    permitted.delete(:closing_date) unless params.key?(:closing_date)
    permitted
  end

  def import_attributes(entries)
    entries.map do |entry|
      entry.permit(:title, :company, :location, :salary, :url, :description, :status).to_h.symbolize_keys
    end
  end
end
