const state = {
  timers: {},
};

const mutations = {
  SET_TIMER(state, { id, startTime }) {
    state.timers[id] = startTime;
  },
};

const actions = {
  initializeTimer({ commit }, { id }) {
    if (!state.timers[id]) {
      commit('SET_TIMER', { id, startTime: Date.now() });
    }
  },
  resetTimer({ commit }, { id }) {
    commit('SET_TIMER', { id, startTime: Date.now() });
  },
};

const getters = {
  getElapsedTime: (state) => (id) => {
    const startTime = state.timers[id];
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};