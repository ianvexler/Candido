Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  root "health#show"
  get "api/v1", to: "health#show"

  scope path: "api" do
    post "sessions/register", to: "sessions#register"
    get "sessions/verify", to: "sessions#verify"
    get "sessions/me", to: "sessions#me"
    post "sessions", to: "sessions#create"
    delete "sessions", to: "sessions#destroy"

    get "job-board-entries/stats", to: "job_board_entries#stats"
    post "job-board-entries/import", to: "job_board_entries#bulk_import"
    get "job-board-entries", to: "job_board_entries#index"
    post "job-board-entries", to: "job_board_entries#create"
    get "job-board-entries/:id", to: "job_board_entries#show"
    put "job-board-entries/:id", to: "job_board_entries#update"
    delete "job-board-entries/:id", to: "job_board_entries#destroy"
    post "job-board-entries/:id/cv", to: "job_board_entries#upload_cv"
    post "job-board-entries/:id/cover-letter", to: "job_board_entries#upload_cover_letter"

    get "notes/:job_board_entry_id", to: "notes#index"
    post "notes", to: "notes#create"
    put "notes/:id", to: "notes#update"
    delete "notes/:id", to: "notes#destroy"

    put "users", to: "users#update"
    get "users", to: "users#index"

    post "feedback-entries", to: "feedback_entries#create"
    get "feedback-entries", to: "feedback_entries#index"
  end

  get "uploads/:filename",
    to: "uploads#show",
    constraints: { filename: /[^\/]+/ },
    format: false
end
