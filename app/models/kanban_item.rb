# == Schema Information
#
# Table name: kanban_items
#
#  id                :bigint           not null, primary key
#  custom_attributes :jsonb
#  position          :integer          not null
#  timer_duration    :integer          default(0)
#  timer_started_at  :datetime
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  account_id        :bigint           not null
#  conversation_id   :bigint           not null
#  kanban_column_id  :bigint           not null
#
# Indexes
#
#  index_kanban_items_on_account_id        (account_id)
#  index_kanban_items_on_conversation_id   (conversation_id)
#  index_kanban_items_on_kanban_column_id  (kanban_column_id)
#
# Foreign Keys
#
#  fk_rails_...  (account_id => accounts.id)
#  fk_rails_...  (conversation_id => conversations.id)
#  fk_rails_...  (kanban_column_id => kanban_columns.id)
#
class KanbanItem < ApplicationRecord
  belongs_to :account
  belongs_to :conversation
  belongs_to :kanban_column

  validates :position, presence: true, uniqueness: { scope: :kanban_column_id }

  default_scope { order(position: :asc) }

  def update_timer
    if timer_started_at
      self.timer_duration = ((Time.current - timer_started_at) / 1.minute).to_i
    end
  end

  def start_timer
    update(timer_started_at: Time.current, timer_duration: 0)
  end

  def stop_timer
    update_timer
    update(timer_started_at: nil)
  end
end
