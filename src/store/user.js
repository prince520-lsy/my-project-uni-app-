import { postLoginWxmin, getMembeProfile } from "@/http/profile";

export default {
  // 命名空间
  namespaced: true,
  state: {
    //  用户信息 登录成功后返回
    profile: null,
    // 会员信息 单独请求接口 返回
    memberProfile: null,
  },
  getters: {},
  mutations: {
    setProfile(state, payload) {
      state.profile = payload;
    },
    setMemberProfile(state, payload) {
      state.memberProfile = payload;
    },
  },
  actions: {
    // 异步执行登录 获取用户信息
    async fetchProfile({ commit }, data) {
      const result = await postLoginWxmin(data);
      commit("setProfile", result.result);
    },
    // 异步 获取会员信息
    async fetchMemberProfile({ commit }) {
      const result = await getMembeProfile();
      commit("setMemberProfile", result.result);
      // return result.result; // 返回了 和 vuex中的一样内存地址的数据
      return { ...result.result }; // 浅拷贝
    },
  },
};