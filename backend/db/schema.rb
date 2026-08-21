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

ActiveRecord::Schema[8.0].define(version: 0) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "FeedbackStatus", ["PENDING", "REVIEWED", "IMPLEMENTED", "CLOSED"]
  create_enum "FeedbackType", ["BUG", "SUGGESTION", "OTHER"]
  create_enum "JobStatus", ["PENDING", "APPLIED", "ASSESSMENT", "INTERVIEW", "OFFERED", "REJECTED", "ACCEPTED", "ARCHIVED"]

  create_table "FeedbackEntry", id: :serial, force: :cascade do |t|
    t.integer "userId", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.text "title", null: false
    t.text "content", null: false
    t.enum "type", default: "OTHER", null: false, enum_type: "\"FeedbackType\""
    t.enum "status", default: "PENDING", null: false, enum_type: "\"FeedbackStatus\""
  end

  create_table "JobBoardEntry", id: :serial, force: :cascade do |t|
    t.text "title", null: false
    t.text "location"
    t.text "description"
    t.text "salary"
    t.text "url"
    t.integer "number", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.enum "status", default: "PENDING", null: false, enum_type: "\"JobStatus\""
    t.integer "userId", null: false
    t.text "company", null: false
    t.text "coverLetterText"
    t.text "cvText"
    t.text "coverLetterFilename"
    t.text "cvFilename"
    t.text "coverLetterKey"
    t.text "cvKey"
    t.datetime "closingDate", precision: 3
    t.index ["title"], name: "JobBoardEntry_title_idx"
    t.index ["userId", "status", "number"], name: "JobBoardEntry_userId_status_number_key", unique: true
  end

  create_table "JobBoardEntryNotes", id: :serial, force: :cascade do |t|
    t.integer "userId", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.text "content", null: false
    t.integer "jobBoardEntryId", null: false
    t.index ["userId", "jobBoardEntryId"], name: "JobBoardEntryNotes_userId_jobBoardEntryId_idx"
  end

  create_table "JobBoardTag", id: :serial, force: :cascade do |t|
    t.text "name", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.integer "userId", null: false
    t.index ["name"], name: "JobBoardTag_name_idx"
    t.index ["userId", "name"], name: "JobBoardTag_userId_name_key", unique: true
  end

  create_table "Session", id: :serial, force: :cascade do |t|
    t.integer "userId", null: false
    t.text "token", null: false
    t.datetime "expiresAt", precision: 3, null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updatedAt", precision: 3, null: false
    t.index ["token"], name: "Session_token_idx"
    t.index ["token"], name: "Session_token_key", unique: true
    t.index ["userId"], name: "Session_userId_idx"
  end

  create_table "User", id: :serial, force: :cascade do |t|
    t.text "email", null: false
    t.text "name"
    t.text "password"
    t.boolean "verified", default: false, null: false
    t.text "verificationToken"
    t.datetime "verificationExpiresAt", precision: 3
    t.boolean "setupCompleted", default: false, null: false
    t.boolean "admin", default: false, null: false
    t.datetime "lastLoginAt", precision: 3
    t.index ["email"], name: "User_email_key", unique: true
  end

  create_table "_JobBoardEntryToJobBoardTag", primary_key: ["A", "B"], force: :cascade do |t|
    t.integer "A", null: false
    t.integer "B", null: false
    t.index ["B"], name: "_JobBoardEntryToJobBoardTag_B_index"
  end

  create_table "_prisma_migrations", id: { type: :string, limit: 36 }, force: :cascade do |t|
    t.string "checksum", limit: 64, null: false
    t.timestamptz "finished_at"
    t.string "migration_name", limit: 255, null: false
    t.text "logs"
    t.timestamptz "rolled_back_at"
    t.timestamptz "started_at", default: -> { "now()" }, null: false
    t.integer "applied_steps_count", default: 0, null: false
  end

  add_foreign_key "FeedbackEntry", "User", column: "userId", name: "FeedbackEntry_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "JobBoardEntry", "User", column: "userId", name: "JobBoardEntry_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "JobBoardEntryNotes", "JobBoardEntry", column: "jobBoardEntryId", name: "JobBoardEntryNotes_jobBoardEntryId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "JobBoardEntryNotes", "User", column: "userId", name: "JobBoardEntryNotes_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "JobBoardTag", "User", column: "userId", name: "JobBoardTag_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "Session", "User", column: "userId", name: "Session_userId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "_JobBoardEntryToJobBoardTag", "JobBoardEntry", column: "A", name: "_JobBoardEntryToJobBoardTag_A_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "_JobBoardEntryToJobBoardTag", "JobBoardTag", column: "B", name: "_JobBoardEntryToJobBoardTag_B_fkey", on_update: :cascade, on_delete: :cascade
end
