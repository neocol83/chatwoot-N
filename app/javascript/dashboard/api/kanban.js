import ApiClient from './ApiClient';

// Use o recurso 'conversations' como base, pois o Kanban provavelmente
// está relacionado às conversas no Chatwoot
const client = new ApiClient('conversations');

export default {
  fetchColumns() {
    return client.get('kanban/columns');
  },
  fetchItems() {
    return client.get('kanban/items');
  },
  createItem(item) {
    return client.create('kanban', item);
  },
  updateItem(id, item) {
    return client.update(`kanban/${id}`, item);
  },
  deleteItem(id) {
    return client.delete(`kanban/${id}`);
  },
  moveItem(id, newColumnId) {
    return client.update(`kanban/${id}/move`, { newColumnId });
  },
  updateEstimates(estimates) {
    return client.update('kanban/estimates', estimates);
  },
  fetchMessageTemplates() {
    return client.get('kanban/message-templates');
  },
  createMessageTemplate(template) {
    return client.create('kanban/message-templates', template);
  },
  updateMessageTemplate(id, template) {
    return client.update(`kanban/message-templates/${id}`, template);
  },
  deleteMessageTemplate(id) {
    return client.delete(`kanban/message-templates/${id}`);
  },

  // Métodos para kanbanOrders
  fetchKanbanOrders(params) {
    return client.get('kanban/orders', params);
  },
  createKanbanOrder(order) {
    return client.create('kanban/orders', order);
  },
  updateKanbanOrder(id, order) {
    return client.update(`kanban/orders/${id}`, order);
  },
  deleteKanbanOrder(id) {
    return client.delete(`kanban/orders/${id}`);
  },
};
