import kanbanAPI from './kanban';

export default {
  get(params) {
    return kanbanAPI.fetchKanbanOrders(params);
  },

  create(data) {
    return kanbanAPI.createKanbanOrder(data);
  },

  update(id, data) {
    return kanbanAPI.updateKanbanOrder(id, data);
  },

  delete(id) {
    return kanbanAPI.deleteKanbanOrder(id);
  },
};
