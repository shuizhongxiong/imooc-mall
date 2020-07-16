<template>
  <div id="app">
    <el-container>
      <el-header>
        <app-header />
      </el-header>
      <el-main>
        <router-view v-if="isRouterAlive" />
      </el-main>
      <el-footer>
        <app-footer />
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  created() {
    this.initUser();
  },
  methods: {
    initUser() {
      const cookies = document.cookie.split(';');
      cookies.forEach(d => {
        const data = d.trim().split('=');
        if (data[0] === 'userName') {
          this.$store.commit('changeUserName', data[1]);
        } else if (data[0] === 'cartCount') {
          this.$store.commit('changeCartCount', +data[1]);
        }
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
  },
};
</script>
