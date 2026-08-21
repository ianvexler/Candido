# == Schema Information
#
# Table name: JobBoardTag
#
#  id        :integer          not null, primary key
#  createdAt :datetime         not null
#  name      :text             not null
#  updatedAt :datetime         not null
#  userId    :integer          not null
#
# Indexes
#
#  JobBoardTag_name_idx         (name)
#  JobBoardTag_userId_name_key  (userId,name) UNIQUE
#
# Foreign Keys
#
#  JobBoardTag_userId_fkey  (userId => User.id) ON DELETE => restrict ON UPDATE => cascade
#
class JobBoardTag < ApplicationRecord
  include PrismaRecord

  use_prisma_table "JobBoardTag"
  prisma_aliases(
    user_id: :userId,
    created_at: :createdAt,
    updated_at: :updatedAt
  )

  belongs_to :user, foreign_key: "userId"
  has_and_belongs_to_many :job_board_entries,
    join_table: JobBoardEntry::JOIN_TABLE,
    foreign_key: "B",
    association_foreign_key: "A"

  validates :name, presence: true, uniqueness: { scope: :userId }

  def self.find_or_create_named!(user, names)
    names.map { |name| name.to_s.strip }.compact_blank.map do |name|
      user.job_board_tags.find_or_create_by!(name: name)
    end
  end
end
