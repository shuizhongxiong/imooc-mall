<template>
  <div class="footer-wrapper">
    <div>
      <span>纯个人练习项目，无任何商业用途！</span>
      <a href="https://github.com/shuizhongxiong/demo-mall" target="_blank">项目地址</a>
    </div>
    <a href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备19071960号</a>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
};
</script>

<style lang="less" scoped>
.footer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  line-height: 20px;
  font-size: 12px;
}
</style>
