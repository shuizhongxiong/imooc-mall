<template>
  <div class="cart-list">
    <el-table
      ref="tableRef"
      height="580"
      v-loading="loading"
      tooltip-effect="light"
      show-summary
      :data="list"
      :summary-method="getSummaries"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60" />
      <el-table-column label="商品" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <product-item
            :img="require(`@/assets/images/product/${row.productImage}`)"
            :name="row.productName"
          />
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" label="价格" align="center">
        <template slot-scope="{ row }">{{ row.salePrice | toRMB }}</template>
      </el-table-column>
      <el-table-column label="数量" align="center" min-widht="100">
        <template slot-scope="{ row }">
          <el-input-number
            style="width: 100px"
            size="small"
            v-model="row.productNum"
            :min="1"
            step-strictly
            @change="handleCountChange($event, row.productId)"
          ></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="总价" align="center">
        <template slot-scope="{ row }">{{ (row.productNum * row.salePrice) | toRMB }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="{ row }">
          <el-button class="danger" type="text" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <span>您的购物车是空的，赶紧去</span>
        <el-button type="text">
          <router-link tag="span" to="/">添加商品</router-link>
        </el-button>
        <span>吧～</span>
      </template>
    </el-table>
  </div>
</template>

<script>
import ProductItem from '@/components/ProductItem';
import { toRMB } from '@/filter';

export default {
  name: 'CartList',
  components: {
    ProductItem,
  },
  data() {
    return {
      list: [],
      loading: false,
      selectionDone: false,
    };
  },
  mounted() {
    this.getCartList();
  },
  methods: {
    async getCartList() {
      this.isInit = true;
      this.list = [];
      this.loading = true;
      const res = await this.$get('/api/carts/list');
      this.loading = false;
      if (res && res.code === 200) {
        this.list = res.result || [];
        this.$store.commit('changeCartCount', this.list.length);
      }
      this.$nextTick(() => {
        const checkedList = this.list.filter(d => d.checked === 1);
        if (checkedList.length > 0) {
          checkedList.forEach((d, i) => {
            if (this.$refs.tableRef) {
              this.$refs.tableRef.toggleRowSelection(d, true);
            }
            // hack toggleRowSelection 会调用 selection-change 方法造成死循环
            if (i === checkedList.length - 1) {
              this.selectionDone = true;
            }
          });
        } else {
          this.selectionDone = true;
        }
        if (this.$refs.tableRef) {
          this.$refs.tableRef.doLayout();
        }
      });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      if (data.length > 0) {
        const checkedData = data.filter(d => d.checked);
        let temp = 0;
        columns.forEach((column, index) => {
          switch (index) {
            case 1:
              sums[index] = `总计（${checkedData.length}）`;
              break;
            case 2:
              if (checkedData.length > 0) {
                temp = checkedData.map(d => d.salePrice).reduce((a, b) => (a += b));
              }
              sums[index] = toRMB(temp);
              break;
            case 3:
              if (checkedData.length > 0) {
                temp = checkedData.map(d => d.productNum).reduce((a, b) => (a += b));
              }
              sums[index] = temp;
              break;
            case 4:
              if (checkedData.length > 0) {
                temp = checkedData.map(d => d.productNum * d.salePrice).reduce((a, b) => (a += b));
              }
              sums[index] = toRMB(temp);
              break;
            default:
              sums[index] = '';
              break;
          }
        });
      }
      return sums;
    },
    handleDelete(data) {
      this.$confirm('您确定删除此条数据么?', '提示', {
        type: 'warning',
      })
        .then(async () => {
          const res = await this.$post('/api/carts/del', { productId: data.productId });
          if (res && res.code === 200) {
            this.getCartList();
            this.$message.success('删除成功');
          }
        })
        .catch(() => {});
    },
    async handleCountChange(value, productId) {
      const params = {
        productId,
        productNum: value,
      };
      await this.$post('/api/carts/edit', params);
    },
    async handleSelectionChange(data) {
      if (!this.selectionDone) {
        return;
      }
      const productIds = data.map(d => d.productId);
      this.list.forEach(d => {
        d.checked = productIds.includes(d.productId) ? 1 : 0;
      });
      await this.$post('/api/carts/checked', { productIds });
    },
  },
};
</script>
