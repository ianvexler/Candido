class FinishPrismaRenameIfNeeded < ActiveRecord::Migration[8.0]
  PRISMA_TABLES = {
    "User" => :users,
    "Session" => :sessions,
    "JobBoardEntry" => :job_board_entries,
    "JobBoardTag" => :job_board_tags,
    "JobBoardEntryNotes" => :job_board_entry_notes,
    "FeedbackEntry" => :feedback_entries,
    "_JobBoardEntryToJobBoardTag" => :job_board_entries_tags
  }.freeze

  EMPTY_RAILS_DROP_ORDER = %i[
    job_board_entries_tags
    job_board_entry_notes
    feedback_entries
    job_board_tags
    job_board_entries
    sessions
    users
  ].freeze

  def up
    drop_empty_rails_tables_if_prisma_still_present!
    rename_remaining_prisma_tables!
    rename_remaining_columns!
    repair_password_columns!
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end

  private

  def prisma_table?(name)
    connection.data_source_exists?(name)
  end

  def row_count(table)
    select_value("SELECT COUNT(*) FROM #{connection.quote_table_name(table)}").to_i
  end

  def drop_empty_rails_tables_if_prisma_still_present!
    return unless prisma_table?("User")
    return unless table_exists?(:users)
    return unless row_count(:users).zero?

    EMPTY_RAILS_DROP_ORDER.each do |table|
      drop_table table, force: :cascade if table_exists?(table)
    end
  end

  def rename_remaining_prisma_tables!
    PRISMA_TABLES.each do |prisma_name, rails_name|
      next unless prisma_table?(prisma_name)
      next if table_exists?(rails_name)

      rename_table prisma_name, rails_name
    end
  end

  def rename_remaining_columns!
    rename_column_if_needed :users, "verificationToken", :verification_token
    rename_column_if_needed :users, "verificationExpiresAt", :verification_expires_at
    rename_column_if_needed :users, "setupCompleted", :setup_completed
    rename_column_if_needed :users, "lastLoginAt", :last_login_at
    rename_column_if_needed :users, "password", :password_digest
    add_timestamps_if_needed :users

    rename_column_if_needed :sessions, "userId", :user_id
    rename_column_if_needed :sessions, "expiresAt", :expires_at
    rename_column_if_needed :sessions, "createdAt", :created_at
    rename_column_if_needed :sessions, "updatedAt", :updated_at

    rename_column_if_needed :job_board_entries, "userId", :user_id
    rename_column_if_needed :job_board_entries, "createdAt", :created_at
    rename_column_if_needed :job_board_entries, "updatedAt", :updated_at
    rename_column_if_needed :job_board_entries, "coverLetterText", :cover_letter_text
    rename_column_if_needed :job_board_entries, "coverLetterKey", :cover_letter_key
    rename_column_if_needed :job_board_entries, "coverLetterFilename", :cover_letter_filename
    rename_column_if_needed :job_board_entries, "cvText", :cv_text
    rename_column_if_needed :job_board_entries, "cvKey", :cv_key
    rename_column_if_needed :job_board_entries, "cvFilename", :cv_filename
    rename_column_if_needed :job_board_entries, "closingDate", :closing_date

    rename_column_if_needed :job_board_tags, "userId", :user_id
    rename_column_if_needed :job_board_tags, "createdAt", :created_at
    rename_column_if_needed :job_board_tags, "updatedAt", :updated_at

    rename_column_if_needed :job_board_entry_notes, "userId", :user_id
    rename_column_if_needed :job_board_entry_notes, "jobBoardEntryId", :job_board_entry_id
    rename_column_if_needed :job_board_entry_notes, "createdAt", :created_at
    rename_column_if_needed :job_board_entry_notes, "updatedAt", :updated_at

    rename_column_if_needed :feedback_entries, "userId", :user_id
    rename_column_if_needed :feedback_entries, "createdAt", :created_at
    rename_column_if_needed :feedback_entries, "updatedAt", :updated_at

    rename_column_if_needed :job_board_entries_tags, "A", :job_board_entry_id
    rename_column_if_needed :job_board_entries_tags, "B", :job_board_tag_id

    drop_table "_prisma_migrations" if table_exists?("_prisma_migrations")
  end

  def rename_column_if_needed(table, from, to)
    return unless table_exists?(table)
    return unless column_exists?(table, from)
    return if column_exists?(table, to)

    rename_column table, from, to
  end

  def add_timestamps_if_needed(table)
    return unless table_exists?(table)

    unless column_exists?(table, :created_at)
      add_column table, :created_at, :datetime, precision: 3, null: false, default: -> { "CURRENT_TIMESTAMP" }
    end
    unless column_exists?(table, :updated_at)
      add_column table, :updated_at, :datetime, precision: 3, null: false, default: -> { "CURRENT_TIMESTAMP" }
    end
  end

  def repair_password_columns!
    return unless table_exists?(:users)

    if column_exists?(:users, :password) && !column_exists?(:users, :password_digest)
      rename_column :users, :password, :password_digest
    elsif column_exists?(:users, :password) && column_exists?(:users, :password_digest)
      execute <<~SQL
        UPDATE users
        SET password_digest = password
        WHERE COALESCE(password_digest, '') = ''
          AND COALESCE(password, '') <> ''
      SQL
      remove_column :users, :password
    end
  end
end
