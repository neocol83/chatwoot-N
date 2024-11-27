import mutationTypes from '../mutation-types';
import kanbanAPI from '../../api/kanbanOrders';

const state = {
  records: {},
  uiFlags: {
    isFetching: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
  },
};

export const getters = {
  getKanbanOrders: $state => $state.records,
  getUIFlags: $state => $state.uiFlags,
};

export const actions = {
  get: async ({ commit }) => {
    commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isFetching: true });
    try {
      const response = await kanbanAPI.get();
      commit(mutationTypes.SET_KANBAN_ORDERS, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isFetching: false });
    }
  },
  create: async ({ commit }, kanbanOrder) => {
    commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isCreating: true });
    try {
      const response = await kanbanAPI.create(kanbanOrder);
      commit(mutationTypes.ADD_KANBAN_ORDER, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isCreating: false });
    }
  },
  update: async ({ commit }, { id, data }) => {
    commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isUpdating: true });
    try {
      const response = await kanbanAPI.update(id, data);
      commit(mutationTypes.UPDATE_KANBAN_ORDER, response.data);
    } catch (error) {
      // Handle error
    } finally {
      commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isUpdating: false });
    }
  },
  delete: async ({ commit }, id) => {
    commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isDeleting: true });
    try {
      await kanbanAPI.delete(id);
      commit(mutationTypes.DELETE_KANBAN_ORDER, id);
    } catch (error) {
      // Handle error
    } finally {
      commit(mutationTypes.SET_KANBAN_ORDERS_UI_FLAG, { isDeleting: false });
    }
  },
};

export const mutations = {
  [mutationTypes.SET_KANBAN_ORDERS_UI_FLAG]($state, data) {
    $state.uiFlags = {
      ...$state.uiFlags,
      ...data,
    };
  },
  [mutationTypes.SET_KANBAN_ORDERS]($state, data) {
    $state.records = data;
  },
  [mutationTypes.ADD_KANBAN_ORDER]($state, data) {
    $state.records = { ...$state.records, [data.id]: data };
  },
  [mutationTypes.UPDATE_KANBAN_ORDER]($state, data) {
    $state.records = { ...$state.records, [data.id]: data };
  },
  [mutationTypes.DELETE_KANBAN_ORDER]($state, id) {
    const { [id]: deletedOrder, ...updatedRecords } = $state.records;
    $state.records = updatedRecords;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
