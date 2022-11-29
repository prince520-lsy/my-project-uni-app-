import { postLoginWxmin } from "@/http/profile";

export default {
  // 命名空间
  namespaced: true,
  state: {
    //  用户信息
    profile: null,
  },
  getters: {},
  mutations: {
    setProfile(state, payload) {
      state.profile = payload;
    },
  },
  actions: {
    // 异步执行登录 获取用户信息
    async fetchProfile({ commit }, data) {
      const result = await postLoginWxmin(data);
      commit("setProfile", result.result);
    },
  },
};