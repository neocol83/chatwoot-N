const state = {
  printerSettings: {},
};

const getters = {
  getPrinterSettings: $state => $state.printerSettings,
};

const actions = {
  updatePrinterSettings({ commit }, settings) {
    commit('SET_PRINTER_SETTINGS', settings);
  },
};

const mutations = {
  SET_PRINTER_SETTINGS($state, settings) {
    $state.printerSettings = settings;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
