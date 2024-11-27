# == Schema Information
#
# Table name: kanban_cards
#
#  id               :bigint           not null, primary key
#  description      :text
#  position         :integer          not null
#  title            :string           not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  kanban_column_id :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_kanban_cards_on_kanban_column_id  (kanban_column_id)
#  index_kanban_cards_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (kanban_column_id => kanban_columns.id)
#  fk_rails_...  (user_id => users.id)
#
class KanbanCard < ApplicationRecord
  belongs_to :kanban_column
  belongs_to :user

  validates :title, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(position: :asc) }
end
