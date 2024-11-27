import types from '../mutation-types';
import { FEATURE_FLAGS } from '../../featureFlags';

const state = {
  isEnabled: false,
};

const getters = {
  isKanbanEnabled: (_state) => _state.isEnabled,
};

const actions = {
  setKanbanEnabled({ commit }, isEnabled) {
    commit(types.SET_KANBAN_ENABLED, isEnabled);
  },
};

const mutations = {
  [types.SET_KANBAN_ENABLED](_state, isEnabled) {
    _state.isEnabled = isEnabled;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
