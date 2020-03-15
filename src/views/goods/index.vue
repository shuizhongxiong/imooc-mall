<template>
  <div class="goods-list">
    <div class="list-control">
      <span>商品价格：</span>
      <el-input
        size="mini"
        placeholder="最小值"
        v-model="minPrice"
        :disabled="filterDisabled"
        @keypress.native="isNumber($event)"
      />
      <span class="control-divider">-</span>
      <el-input
        size="mini"
        placeholder="最大值"
        v-model="maxPrice"
        :disabled="filterDisabled"
        @keypress.native="isNumber($event)"
      />
      <el-button
        :disabled="filterDisabled || minPrice === '' || maxPrice === ''"
        type="primary"
        size="mini"
        @click="filterPrice()"
      >
        确定
      </el-button>
    </div>
    <el-table
      tooltip-effect="light"
      v-loading="loading"
      height="540"
      :data="list"
      @sort-change="changeSort($event)"
    >
      <el-table-column prop="productId" label="ID" sortable="custom" width="120"></el-table-column>
      <el-table-column label="商品" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <product-item
            :img="require(`@/assets/images/product/${row.productImage}`)"
            :name="row.productName"
          />
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" label="价格" sortable="custom">
        <template slot-scope="{ row }">{{ row.salePrice | toRMB }}</template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="handleCart(row.productId)">
            加入购物车
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, ->, prev, pager, next"
      :page-size="limit"
      :total="total"
      :current-page="curentPage"
      @current-change="changePage($event)"
    />
  </div>
</template>

<script>
import ProductItem from '@/components/ProductItem';

export default {
  name: 'goods-list',
  components: {
    ProductItem,
  },
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      curentPage: 1,
      limit: 10,
      sortKey: '',
      sortType: '', // ascending-升序 descending-降序
      minPrice: '',
      maxPrice: '',
      filterParams: {},
    };
  },
  computed: {
    filterDisabled: function() {
      return this.loading || this.list.length === 0;
    },
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getUrl(name) {
      return require(`@/assets/images/product/${name}`);
    },
    async getGoodsList() {
      this.loading = true;
      const param = {
        start: (this.curentPage - 1) * this.limit,
        limit: this.limit,
        sortKey: this.sortKey,
        sortType: this.sortType,
        minPrice: this.filterParams.minPrice,
        maxPrice: this.filterParams.maxPrice,
      };
      const res = await this.$get('/imall/goods', param);
      this.loading = false;
      if (res && res.code === 200) {
        const result = res.result;
        this.list = result.list;
        this.total = result.total;
      }
    },
    changePage(page) {
      this.curentPage = page;
      this.getGoodsList();
    },
    changeSort(data) {
      this.sortKey = data.prop;
      this.sortType = data.order;
      this.curentPage = 1;
      this.getGoodsList();
    },
    filterPrice() {
      if (isNaN(+this.minPrice) || isNaN(+this.maxPrice)) {
        this.filterParams = {};
      } else {
        this.filterParams = {
          minPrice: +this.minPrice,
          maxPrice: +this.maxPrice,
        };
      }
      this.curentPage = 1;
      this.getGoodsList();
    },
    isNumber(e) {
      let keyCode = e.keyCode ? e.keyCode : e.which;
      if (keyCode > 31 && (keyCode < 48 || keyCode > 57) && keyCode !== 46) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    async handleCart(productId) {
      const res = await this.$post(`/imall/goods/addCart`, { productId });
      if (res && res.code === 200) {
        this.$confirm('加入购物车成功', '提示', {
          confirmButtonText: '继续购物',
          cancelButtonText: '查看购物车',
          type: 'success',
        }).catch(() => {
          this.$router.push('/cart').catch(() => {});
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  color: #606266;
  font-size: 12px;
  .list-control {
    .el-input {
      width: 80px;
    }
    .el-button {
      margin-left: 8px;
    }
    .control-divider {
      margin: 0 4px;
      color: #dcdfe6;
    }
  }
  .el-table {
    width: 100%;
  }
  .el-pagination {
    margin-top: 16px;
  }
}
</style>
