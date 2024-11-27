import * as types from '../mutation-types';
import ConversationAPI from '../../api/conversations';

const actions = {
  get: async ({ commit }) => {
    try {
      const response = await ConversationAPI.get();
      commit(types.SET_CONVERSATIONS, response.data.payload);
      return response.data;
    } catch (error) {
      // Trate o erro adequadamente
    }
  },
  // ... outras actions ...
};

// ... resto do código do módulo ...
