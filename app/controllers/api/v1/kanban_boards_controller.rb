class Api::V1::KanbanBoardsController < Api::V1::BaseController
  before_action :set_kanban_board, only: [:show, :update, :destroy]

  def index
    @kanban_boards = Current.account.kanban_boards
    render json: @kanban_boards
  end

  def show
    render json: @kanban_board.to_json(include: { kanban_columns: { include: :kanban_cards } })
  end

  def create
    @kanban_board = Current.account.kanban_boards.new(kanban_board_params)
    @kanban_board.user = Current.user

    if @kanban_board.save
      render json: @kanban_board, status: :created
    else
      render json: @kanban_board.errors, status: :unprocessable_entity
    end
  end

  def update
    if @kanban_board.update(kanban_board_params)
      render json: @kanban_board
    else
      render json: @kanban_board.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @kanban_board.destroy
    head :no_content
  end

  private

  def set_kanban_board
    @kanban_board = Current.account.kanban_boards.find(params[:id])
  end

  def kanban_board_params
    params.require(:kanban_board).permit(:name, :description)
  end
end
