class Api::V1::KanbanController < Api::V1::BaseController
  before_action :fetch_conversation, only: [:move, :update, :destroy]

  def columns
    # Implemente a lógica para retornar as colunas do Kanban
    render json: { columns: [] }
  end

  def items
    # Implemente a lógica para retornar os itens do Kanban
    render json: { items: [] }
  end

  def create
    # Implemente a lógica para criar um novo item
    render json: { message: 'Item criado com sucesso' }, status: :created
  end

  def update
    # Implemente a lógica para atualizar um item
    render json: { message: 'Item atualizado com sucesso' }
  end

  def destroy
    # Implemente a lógica para excluir um item
    render json: { message: 'Item excluído com sucesso' }
  end

  def move
    # Implemente a lógica para mover um item
    render json: { message: 'Item movido com sucesso' }
  end

  def estimates
    # Implemente a lógica para atualizar estimativas
    render json: { message: 'Estimativas atualizadas com sucesso' }
  end

  def message_templates
    # Implemente a lógica para retornar templates de mensagem
    render json: { message_templates: [] }
  end

  private

  def fetch_conversation
    @conversation = Current.account.conversations.find(params[:id])
  end
end
