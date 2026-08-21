class NotesController < ApplicationController
  before_action :require_authentication
  before_action :set_job_board_entry, only: %i[index create]
  before_action :set_note, only: %i[update destroy]

  def index
    render json: { notes: serialize(@job_board_entry.job_board_entry_notes, with: JobBoardEntryNoteBlueprint) }
  end

  def create
    note = @job_board_entry.job_board_entry_notes.create!(note_params.merge(user: current_user))
    render json: { note: serialize(note, with: JobBoardEntryNoteBlueprint) }
  end

  def update
    @note.update!(note_params)
    render json: { note: serialize(@note, with: JobBoardEntryNoteBlueprint) }
  end

  def destroy
    snapshot = serialize(@note, with: JobBoardEntryNoteBlueprint)
    @note.destroy!
    render json: { note: snapshot }
  end

  private

  def set_job_board_entry
    @job_board_entry = JobBoardEntry.find_owned!(
      current_user,
      params[:job_board_entry_id],
      unauthorized_message: "You are not authorized to view this job board entry"
    )
  end

  def set_note
    @note = JobBoardEntryNote.find_owned!(current_user, params[:id])
  end

  def note_params
    params.permit(:content)
  end
end
