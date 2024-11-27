class Api::V1::KanbanColumnsController < Api::V1::BaseController
  before_action :set_kanban_board
  before_action :set_kanban_column, only: [:show, :update, :destroy]

  def index
    @kanban_columns = @kanban_board.kanban_columns
    render json: @kanban_columns
  end

  def show
    render json: @kanban_column.to_json(include: :kanban_cards)
  end

  def create
    @kanban_column = @kanban_board.kanban_columns.new(kanban_column_params)

    if @kanban_column.save
      render json: @kanban_column, status: :created
    else
      render json: @kanban_column.errors, status: :unprocessable_entity
    end
  end

  def update
    if @kanban_column.update(kanban_column_params)
      render json: @kanban_column
    else
      render json: @kanban_column.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @kanban_column.destroy
    head :no_content
  end

  private

  def set_kanban_board
    @kanban_board = Current.account.kanban_boards.find(params[:kanban_board_id])
  end

  def set_kanban_column
    @kanban_column = @kanban_board.kanban_columns.find(params[:id])
  end

  def kanban_column_params
    params.require(:kanban_column).permit(:name, :position)
  end
end
