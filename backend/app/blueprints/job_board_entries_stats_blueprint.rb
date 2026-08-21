class JobBoardEntriesStatsBlueprint < ApplicationBlueprint
  field :counts do |stats, _|
    stats[:counts]
  end
  field :this_week do |stats, _|
    stats[:this_week]
  end
  field :last_week do |stats, _|
    stats[:last_week]
  end
  field :response_rate do |stats, _|
    stats[:response_rate]
  end
  field :top_tags do |stats, _|
    stats[:top_tags]
  end
end
