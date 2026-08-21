class JobBoardEntryBlueprint < ApplicationBlueprint
  identifier :id
  fields :number, :title, :company, :location, :description, :salary, :url, :status,
    :created_at, :updated_at, :closing_date, :cv_text, :cv_key, :cv_filename,
    :cover_letter_text, :cover_letter_key, :cover_letter_filename

  association :job_board_tags, blueprint: JobBoardTagBlueprint
end
