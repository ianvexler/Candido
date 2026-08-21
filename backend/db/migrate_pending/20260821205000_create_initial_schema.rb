class CreateInitialSchema < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :name
      t.string :password_digest
      t.boolean :verified, null: false, default: false
      t.string :verification_token
      t.datetime :verification_expires_at
      t.boolean :setup_completed, null: false, default: false
      t.boolean :admin, null: false, default: false
      t.datetime :last_login_at

      t.timestamps
    end
    add_index :users, :email, unique: true
    add_index :users, :verification_token

    create_table :sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :token, null: false
      t.datetime :expires_at, null: false

      t.timestamps
    end
    add_index :sessions, :token, unique: true

    create_table :job_board_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.string :company, null: false
      t.string :location
      t.text :description
      t.string :salary
      t.string :url
      t.integer :number, null: false
      t.string :status, null: false, default: "PENDING"
      t.text :cover_letter_text
      t.string :cover_letter_key
      t.string :cover_letter_filename
      t.text :cv_text
      t.string :cv_key
      t.string :cv_filename
      t.datetime :closing_date

      t.timestamps
    end
    add_index :job_board_entries, :title
    add_index :job_board_entries, [ :user_id, :status, :number ], unique: true

    create_table :job_board_tags do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false

      t.timestamps
    end
    add_index :job_board_tags, :name
    add_index :job_board_tags, [ :user_id, :name ], unique: true

    create_table :job_board_entries_job_board_tags, id: false do |t|
      t.references :job_board_entry, null: false, foreign_key: { on_delete: :cascade }
      t.references :job_board_tag, null: false, foreign_key: { on_delete: :cascade }
    end
    add_index :job_board_entries_job_board_tags,
      [ :job_board_entry_id, :job_board_tag_id ],
      unique: true,
      name: "index_job_board_entries_tags_uniqueness"

    create_table :job_board_entry_notes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :job_board_entry, null: false, foreign_key: true
      t.text :content, null: false

      t.timestamps
    end
    add_index :job_board_entry_notes, [ :user_id, :job_board_entry_id ]

    create_table :feedback_entries do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :content, null: false
      t.string :type, null: false, default: "OTHER"
      t.string :status, null: false, default: "PENDING"

      t.timestamps
    end
  end
end
