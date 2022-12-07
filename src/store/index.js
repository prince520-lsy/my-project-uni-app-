// 页面路径：store/index.js
import Vue from "vue";
import Vuex from "vuex";
import persistence from "vuex-uniapp-persistence"; // 引入uniapp中vuex持久化插件

// 引入用户模块
import user from "./user";

// 引入地址模块
import address from "./address";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    safeArea: uni.getSystemInfoSync().safeArea, // 获取系统信息
    bounding: uni.getMenuButtonBoundingClientRect(), // 获取胶囊信息
    // 手机平台
    platform: uni.getSystemInfoSync().platform,
  },
  getters: {},
  mutations: {},
  modules: { user, address },
  plugins: [persistence("rabbit")], // 使用 持久化插件  rabbit 本地存储中的key
});
export default store;
