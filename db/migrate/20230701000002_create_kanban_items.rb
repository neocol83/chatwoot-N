class CreateKanbanItems < ActiveRecord::Migration[7.0]
  def change
    unless table_exists?(:kanban_items)
      create_table :kanban_items do |t|
        t.references :account, null: false, foreign_key: true
        t.references :conversation, null: false, foreign_key: true
        t.references :kanban_column, null: false, foreign_key: true
        t.integer :position, null: false
        t.jsonb :custom_attributes, default: {}
        t.datetime :timer_started_at
        t.integer :timer_duration, default: 0

        t.timestamps
      end
    end
  end
end
