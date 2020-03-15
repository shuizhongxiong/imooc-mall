<template>
  <el-dialog
    title="登陆"
    width="380px"
    hide-required-asterisk
    :visible.sync="show"
    :before-close="handleClose"
  >
    <el-form :model="formData" label-width="70px">
      <el-form-item label="用户名：" prop="userName">
        <el-input ref="userNameRef" v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码：" prop="userPwd">
        <el-input
          type="password"
          v-model="formData.userPwd"
          autocomplete="off"
          @keyup.enter.native="submitForm"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="btnDisabled" :loading="btnLoading" @click="submitForm"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'LoginDialog',
  inject: ['reload'],
  data() {
    return {
      show: false,
      btnLoading: false,
      formData: {
        userName: '',
        userPwd: '',
      },
    };
  },
  computed: {
    btnDisabled() {
      return !this.formData.userName || !this.formData.userPwd;
    },
    ...mapState(['loginVisible']),
  },
  watch: {
    loginVisible(newVal) {
      this.show = newVal;
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.userNameRef.getInput().focus();
        });
      }
    },
  },
  methods: {
    async submitForm() {
      if (this.btnDisabled) {
        return;
      }
      this.btnLoading = true;
      const res = await this.$post('/imall/users/login', this.formData);
      this.btnLoading = false;
      if (res && res.code === 200) {
        this.$store.commit('changeUserName', res.result.userName);
        this.$store.commit('changeCartCount', +res.result.cartCount);
        this.handleClose();
        this.reload();
      } else {
        this.$message.error(res.msg);
      }
    },
    handleClose() {
      this.$store.commit('changeLoginVisible', false);
    },
  },
};
</script>
