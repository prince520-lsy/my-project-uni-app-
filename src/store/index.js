// 页面路径：store/index.js
import Vue from "vue";
import Vuex from "vuex";
import persistence from "vuex-uniapp-persistence"; // 引入uniapp中vuex持久化插件
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    text: "",
  },
  getters: {},
  mutations: {
    setText(state, payload) {
      state.text = payload;
    },
  },
  modules: {},
  plugins: [persistence("rabbit")], // 使用 持久化插件  rabbit 本地存储中的key
});
export default store;