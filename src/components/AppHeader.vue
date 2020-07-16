<template>
  <div class="header">
    <div class="header-box box-left">
      <div class="box-item item-logo" @click="goHome">
        <img src="@/assets/logo.png" alt="logo" />
      </div>
      <div class="box-item item-title">Demo Mall</div>
    </div>
    <div class="header-box box-right">
      <div class="box-item">
        <el-button type="text" v-if="currentPath !== '/'">
          <router-link tag="span" to="/">首页</router-link>
        </el-button>
      </div>
      <div class="box-item item-cart" v-if="userName && currentPath !== '/cart'" @click="goCart">
        <i v-if="cartCount" class="el-icon-shopping-cart-full"></i>
        <i v-else class="el-icon-shopping-cart-2"></i>
      </div>
      <div class="box-item item-user">
        <el-button v-if="!userName" type="text" @click="login">Login</el-button>
        <el-dropdown v-else>
          <span class="user-name">{{ userName }} <i class="el-icon-arrow-down"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <login-dialog />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoginDialog from '@/components/LoginDialog';

export default {
  name: 'app-header',
  components: {
    LoginDialog,
  },
  computed: {
    ...mapState(['userName', 'cartCount']),
    currentPath() {
      return this.$route.path || '';
    },
  },
  methods: {
    login() {
      this.$store.commit('changeLoginVisible', true);
    },
    async logout() {
      const res = await this.$post('/api/users/logout');
      if (res && res.code === 200) {
        this.$store.commit('changeUserName', '');
        this.$store.commit('changeCartCount', 0);
        this.$router.push('/').catch(() => {});
      }
    },
    goCart() {
      this.$router.push('/cart').catch(() => {});
    },
    goHome() {
      this.$router.push('/').catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-bottom: 1px solid #dcdfe6;
  .header-box {
    display: flex;
    align-items: center;
    &.box-left .box-item {
      margin-right: 14px;
    }
    &.box-right .box-item {
      margin-left: 14px;
    }
    .box-item {
      &.item-logo {
        margin-right: 8px;
        height: 38px;
        cursor: pointer;
        > img {
          display: block;
          width: auto;
          height: 100%;
        }
      }
      &.item-title {
        font-size: 14px;
        font-weight: bold;
        color: #303133;
      }
      &.item-user {
        .user-name {
          cursor: pointer;
        }
      }
      &.item-cart {
        cursor: pointer;
      }
    }
  }
}
</style>
