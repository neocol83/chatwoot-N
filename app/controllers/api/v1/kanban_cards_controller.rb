class Api::V1::KanbanCardsController < Api::V1::BaseController
  before_action :set_kanban_column
  before_action :set_kanban_card, only: [:show, :update, :destroy]

  def index
    @kanban_cards = @kanban_column.kanban_cards
    render json: @kanban_cards
  end

  def show
    render json: @kanban_card
  end

  def create
    @kanban_card = @kanban_column.kanban_cards.new(kanban_card_params)
    @kanban_card.user = Current.user

    if @kanban_card.save
      render json: @kanban_card, status: :created
    else
      render json: @kanban_card.errors, status: :unprocessable_entity
    end
  end

  def update
    if @kanban_card.update(kanban_card_params)
      render json: @kanban_card
    else
      render json: @kanban_card.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @kanban_card.destroy
    head :no_content
  end

  private

  def set_kanban_column
    @kanban_column = KanbanColumn.find(params[:kanban_column_id])
  end

  def set_kanban_card
    @kanban_card = @kanban_column.kanban_cards.find(params[:id])
  end

  def kanban_card_params
    params.require(:kanban_card).permit(:title, :description, :position)
  end
end
