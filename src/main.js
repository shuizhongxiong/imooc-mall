import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'normalize.css';
import 'styles/common.css';
import 'styles/element-cover.less';
import http, { get, post } from '@/request/http';

import * as filter from './filter';
Object.keys(filter).forEach(key => {
  Vue.filter(key, filter[key]);
});

import ElementUI from 'element-ui';
Vue.use(ElementUI);

Vue.prototype.$http = http;
Vue.prototype.$get = get;
Vue.prototype.$post = post;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
