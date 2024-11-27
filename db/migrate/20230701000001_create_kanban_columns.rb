class CreateKanbanColumns < ActiveRecord::Migration[7.0]
  def change
    unless table_exists?(:kanban_columns)
      create_table :kanban_columns do |t|
        t.references :account, null: false, foreign_key: true
        t.string :name, null: false
        t.integer :position, null: false
        t.string :color, default: '#1f93ff'

        t.timestamps
      end
    end
  end
end
