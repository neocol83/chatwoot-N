# == Schema Information
#
# Table name: kanban_boards
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  account_id  :bigint           not null
#  user_id     :bigint           not null
#
# Indexes
#
#  index_kanban_boards_on_account_id  (account_id)
#  index_kanban_boards_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (user_id => users.id)
#
class KanbanBoard < ApplicationRecord
  belongs_to :account
  belongs_to :user
  has_many :kanban_columns, dependent: :destroy
  has_many :kanban_cards, through: :kanban_columns

  validates :name, presence: true
end
