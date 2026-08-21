class FeedbackEntryBlueprint < ApplicationBlueprint
  identifier :id
  fields :user_id, :title, :content, :type, :status, :created_at, :updated_at

  association :user, blueprint: UserBlueprint
end
