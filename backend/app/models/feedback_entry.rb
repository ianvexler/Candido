class FeedbackEntry < ApplicationRecord
  TYPES = %w[BUG SUGGESTION OTHER].freeze
  STATUSES = %w[PENDING REVIEWED IMPLEMENTED CLOSED].freeze

  self.inheritance_column = nil

  belongs_to :user

  enum :type, TYPES.index_by(&:itself), default: "OTHER", validate: true
  enum :status, STATUSES.index_by(&:itself), default: "PENDING", validate: true

  validates :title, :content, presence: true
end
