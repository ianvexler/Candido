Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  root "health#show"
  get "api/v1", to: "health#show"

  scope path: "api/v1" do
    post "sessions/register", to: "sessions#register"
    get "sessions/verify", to: "sessions#verify"
    get "sessions/me", to: "sessions#me"
    post "sessions", to: "sessions#create"
    delete "sessions", to: "sessions#destroy"

    get "job_board_entries/stats", to: "job_board_entries#stats"
    post "job_board_entries/import", to: "job_board_entries#bulk_import"
    get "job_board_entries", to: "job_board_entries#index"
    post "job_board_entries", to: "job_board_entries#create"
    get "job_board_entries/:id", to: "job_board_entries#show"
    put "job_board_entries/:id", to: "job_board_entries#update"
    delete "job_board_entries/:id", to: "job_board_entries#destroy"
    post "job_board_entries/:id/cv", to: "job_board_entries#upload_cv"
    post "job_board_entries/:id/cover_letter", to: "job_board_entries#upload_cover_letter"

    get "notes/:job_board_entry_id", to: "notes#index"
    post "notes", to: "notes#create"
    put "notes/:id", to: "notes#update"
    delete "notes/:id", to: "notes#destroy"

    put "users", to: "users#update"
    get "users", to: "users#index"

    post "feedback_entries", to: "feedback_entries#create"
    get "feedback_entries", to: "feedback_entries#index"

    get "uploads/:filename",
      to: "uploads#show",
      constraints: { filename: /[^\/]+/ },
      format: false
  end
end
