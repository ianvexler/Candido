class JobBoardEntryNoteBlueprint < ApplicationBlueprint
  identifier :id
  fields :user_id, :job_board_entry_id, :content, :created_at, :updated_at
end
