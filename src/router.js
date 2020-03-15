import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'goods',
      component: () => import('./views/goods/index.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('./views/cart/index.vue'),
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
