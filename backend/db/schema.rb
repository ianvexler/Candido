# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_08_21_224000) do
  enable_extension "pg_catalog.plpgsql"

  create_enum "FeedbackStatus", ["PENDING", "REVIEWED", "IMPLEMENTED", "CLOSED"]
  create_enum "FeedbackType", ["BUG", "SUGGESTION", "OTHER"]
  create_enum "JobStatus", ["PENDING", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFERED", "REJECTED", "ACCEPTED", "ARCHIVED"]

  create_table "users", id: :serial, force: :cascade do |t|
    t.text "email", null: false
    t.text "name"
    t.text "password_digest"
    t.boolean "verified", default: false, null: false
    t.text "verification_token"
    t.datetime "verification_expires_at", precision: 3
    t.boolean "setup_completed", default: false, null: false
    t.boolean "admin", default: false, null: false
    t.datetime "last_login_at", precision: 3
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "sessions", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.text "token", null: false
    t.datetime "expires_at", precision: 3, null: false
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, null: false
    t.index ["token"], name: "index_sessions_on_token", unique: true
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "job_board_entries", id: :serial, force: :cascade do |t|
    t.text "title", null: false
    t.text "location"
    t.text "description"
    t.text "salary"
    t.text "url"
    t.integer "number", null: false
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, null: false
    t.enum "status", default: "PENDING", null: false, enum_type: "\"JobStatus\""
    t.integer "user_id", null: false
    t.text "company", null: false
    t.text "cover_letter_text"
    t.text "cv_text"
    t.text "cover_letter_filename"
    t.text "cv_filename"
    t.text "cover_letter_key"
    t.text "cv_key"
    t.datetime "closing_date", precision: 3
    t.index ["title"], name: "index_job_board_entries_on_title"
    t.index ["user_id", "status", "number"], name: "index_job_board_entries_on_user_id_and_status_and_number", unique: true
  end

  create_table "job_board_entry_notes", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, null: false
    t.text "content", null: false
    t.integer "job_board_entry_id", null: false
    t.index ["user_id", "job_board_entry_id"], name: "index_job_board_entry_notes_on_user_id_and_job_board_entry_id"
  end

  create_table "job_board_tags", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, null: false
    t.integer "user_id", null: false
    t.index ["name"], name: "index_job_board_tags_on_name"
    t.index ["user_id", "name"], name: "index_job_board_tags_on_user_id_and_name", unique: true
  end

  create_table "feedback_entries", id: :serial, force: :cascade do |t|
    t.integer "user_id", null: false
    t.datetime "created_at", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", precision: 3, null: false
    t.text "title", null: false
    t.text "content", null: false
    t.enum "type", default: "OTHER", null: false, enum_type: "\"FeedbackType\""
    t.enum "status", default: "PENDING", null: false, enum_type: "\"FeedbackStatus\""
  end

  create_table "job_board_entries_tags", primary_key: ["job_board_entry_id", "job_board_tag_id"], force: :cascade do |t|
    t.integer "job_board_entry_id", null: false
    t.integer "job_board_tag_id", null: false
    t.index ["job_board_tag_id"], name: "index_job_board_entries_tags_on_job_board_tag_id"
  end

  add_foreign_key "sessions", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "job_board_entries", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "job_board_tags", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "job_board_entry_notes", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "job_board_entry_notes", "job_board_entries", on_update: :cascade, on_delete: :restrict
  add_foreign_key "feedback_entries", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "job_board_entries_tags", "job_board_entries", on_update: :cascade, on_delete: :cascade
  add_foreign_key "job_board_entries_tags", "job_board_tags", on_update: :cascade, on_delete: :cascade
end
