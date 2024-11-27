class Api::V1::Accounts::KanbanItemsController < Api::V1::Accounts::BaseController
  before_action :fetch_kanban_item, except: [:index, :create]

  def index
    @kanban_items = Current.account.kanban_items.includes(:conversation, :kanban_column)
  end

  def create
    @kanban_item = Current.account.kanban_items.new(kanban_item_params)
    if @kanban_item.save
      render json: @kanban_item
    else
      render json: @kanban_item.errors, status: :unprocessable_entity
    end
  end

  def update
    if @kanban_item.update(kanban_item_params)
      render json: @kanban_item
    else
      render json: @kanban_item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @kanban_item.destroy
    head :no_content
  end

  def start_timer
    @kanban_item.start_timer
    render json: @kanban_item
  end

  def stop_timer
    @kanban_item.stop_timer
    render json: @kanban_item
  end

  private

  def fetch_kanban_item
    @kanban_item = Current.account.kanban_items.find(params[:id])
  end

  def kanban_item_params
    params.require(:kanban_item).permit(:conversation_id, :kanban_column_id, :position, custom_attributes: {})
  end
end
