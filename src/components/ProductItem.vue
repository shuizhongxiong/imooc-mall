<template>
  <div class="product-item">
    <div class="item-img">
      <el-image :src="img" :alt="name" :preview-src-list="imgList" />
      <div class="img-zoom">
        <i class="el-icon-zoom-in"></i>
      </div>
    </div>
    <span class="item-name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  name: 'ProductItem',
  props: {
    name: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '',
    },
  },
  computed: {
    imgList() {
      return [this.img];
    },
  },
};
</script>

<style lang="less" scoped>
.product-item {
  display: flex;
  align-items: center;
  .item-img {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
    margin-right: 8px;
    width: 60px;
    height: 60px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    &:hover .img-zoom {
      opacity: 1;
    }
    .el-image {
      display: block;
      cursor: pointer;
    }
    .img-zoom {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      pointer-events: none;
    }
  }
  .item-name {
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    color: #606266;
  }
}
</style>
