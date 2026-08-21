class RenamePrismaSchemaToRails < ActiveRecord::Migration[8.0]
  def up
    return if table_exists?(:users) && column_exists?(:users, :password_digest)

    unless table_exists?("User")
      raise ActiveRecord::IrreversibleMigration, 'Expected Prisma table "User" (or users already migrated)'
    end

    rename_table "User", :users
    rename_column :users, "verificationToken", :verification_token
    rename_column :users, "verificationExpiresAt", :verification_expires_at
    rename_column :users, "setupCompleted", :setup_completed
    rename_column :users, "lastLoginAt", :last_login_at
    rename_column :users, "password", :password_digest
    add_column :users, :created_at, :datetime, precision: 3, null: false, default: -> { "CURRENT_TIMESTAMP" }
    add_column :users, :updated_at, :datetime, precision: 3, null: false, default: -> { "CURRENT_TIMESTAMP" }

    rename_table "Session", :sessions
    rename_column :sessions, "userId", :user_id
    rename_column :sessions, "expiresAt", :expires_at
    rename_column :sessions, "createdAt", :created_at
    rename_column :sessions, "updatedAt", :updated_at

    rename_table "JobBoardEntry", :job_board_entries
    rename_column :job_board_entries, "userId", :user_id
    rename_column :job_board_entries, "createdAt", :created_at
    rename_column :job_board_entries, "updatedAt", :updated_at
    rename_column :job_board_entries, "coverLetterText", :cover_letter_text
    rename_column :job_board_entries, "coverLetterKey", :cover_letter_key
    rename_column :job_board_entries, "coverLetterFilename", :cover_letter_filename
    rename_column :job_board_entries, "cvText", :cv_text
    rename_column :job_board_entries, "cvKey", :cv_key
    rename_column :job_board_entries, "cvFilename", :cv_filename
    rename_column :job_board_entries, "closingDate", :closing_date

    rename_table "JobBoardTag", :job_board_tags
    rename_column :job_board_tags, "userId", :user_id
    rename_column :job_board_tags, "createdAt", :created_at
    rename_column :job_board_tags, "updatedAt", :updated_at

    rename_table "JobBoardEntryNotes", :job_board_entry_notes
    rename_column :job_board_entry_notes, "userId", :user_id
    rename_column :job_board_entry_notes, "jobBoardEntryId", :job_board_entry_id
    rename_column :job_board_entry_notes, "createdAt", :created_at
    rename_column :job_board_entry_notes, "updatedAt", :updated_at

    rename_table "FeedbackEntry", :feedback_entries
    rename_column :feedback_entries, "userId", :user_id
    rename_column :feedback_entries, "createdAt", :created_at
    rename_column :feedback_entries, "updatedAt", :updated_at

    rename_table "_JobBoardEntryToJobBoardTag", :job_board_entries_tags
    rename_column :job_board_entries_tags, "A", :job_board_entry_id
    rename_column :job_board_entries_tags, "B", :job_board_tag_id

    drop_table "_prisma_migrations" if table_exists?("_prisma_migrations")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
