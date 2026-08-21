class UserBlueprint < ApplicationBlueprint
  identifier :id
  fields :email, :name, :verified, :admin, :setup_completed, :last_login_at

  field :job_board_entries_count, if: ->(_field, _user, options) { options[:entry_counts].present? } do |user, options|
    options[:entry_counts][user.id] || 0
  end
end
