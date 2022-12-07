export default {
    // 命名空间
    namespaced: true,
    state: {
      selectedAddress: null,
    },
    getters: {},
    mutations: {
      setSelectedAddress(state, payload) {
        state.selectedAddress = payload;
      },
    },
    actions: {},
  };
  