import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginVisible: false,
    userName: '',
    cartCount: 0,
  },
  mutations: {
    changeUserName(state, payload) {
      state.userName = payload;
    },
    changeLoginVisible(state, payload) {
      state.loginVisible = payload;
    },
    changeCartCount(state, payload) {
      state.cartCount = payload;
    },
  },
  actions: {},
});
