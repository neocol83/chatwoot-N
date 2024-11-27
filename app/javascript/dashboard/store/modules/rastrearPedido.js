import types from '../mutation-types';
import { FEATURE_FLAGS } from '../../featureFlags';

const state = {
  isEnabled: false,
};

const getters = {
  isRastreioEnabled: (_state) => _state.isEnabled,
};

const actions = {
  setRastreioEnabled({ commit }, isEnabled) {
    commit(types.SET_RASTREIO_ENABLED, isEnabled);
  },
};

const mutations = {
  [types.SET_RASTREIO_ENABLED](_state, isEnabled) {
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