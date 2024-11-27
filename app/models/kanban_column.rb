# == Schema Information
#
# Table name: kanban_columns
#
#  id              :bigint           not null, primary key
#  name            :string           not null
#  position        :integer          not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  kanban_board_id :bigint           not null
#
# Indexes
#
#  index_kanban_columns_on_kanban_board_id  (kanban_board_id)
#
# Foreign Keys
#
#  fk_rails_...  (kanban_board_id => kanban_boards.id)
#
class KanbanColumn < ApplicationRecord
  belongs_to :kanban_board
  has_many :kanban_cards, dependent: :destroy

  validates :name, presence: true
  validates :position, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  default_scope { order(position: :asc) }
end
