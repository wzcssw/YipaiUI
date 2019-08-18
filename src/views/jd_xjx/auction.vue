<template>
  <!-- 委托对话框 -->
  <el-dialog :title="'委托'" :visible.sync="auctionVisible" width="430px">
    <div class="box-item">
      <span class="field-label">最高出价:</span>
      <el-input v-model="amount" :placeholder="'最高出价'" style="width: 180px;margin-left: 15px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-checkbox v-model="is_important" style="margin-left: 10px">
        <span class="check-label">标记重点单</span>
      </el-checkbox>
      <div style="margin-top: 25px">
        <p class="sm-p">销售编号: {{ row.order_id }}</p>
        <p class="sm-p" style="margin-left: 25px">新品参考价: {{ row.reference_price }}</p>
      </div>
      <code style="margin-top:15px;">*最大出价即预计竞拍此商品的最大出价值，我们会为您定时以此为参考抢购</code>

      <el-button type="text" size="mini" @click="showExtend = !showExtend">
        <i :class="{ 'el-icon-arrow-up': showExtend, 'el-icon-arrow-down': !showExtend}">显示高级</i>
      </el-button>
      <el-collapse-transition>
        <div v-show="showExtend" style="background-color: #eef1f6 ;padding: 15px; margin-top: 3px; height: 50px">
          <el-checkbox v-model="exceed_price" name="type">
            <span class="check-label">允许超过最大价格</span>
          </el-checkbox>
          <el-checkbox v-model="anytime_bid" name="type">
            <span class="check-label">允许任意时间出价</span>
          </el-checkbox>
        </div>
      </el-collapse-transition>

    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="isAuctioned()" v-waves type="danger" icon="el-icon-error">停止委托</el-button>
      <el-button v-waves :loading="loadingSaveBtn" type="primary" @click="createData()">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { addAuction } from '@/api/jdXjx'
import waves from '@/directive/waves'

export default {
  directives: { waves },
  data() {
    return {
      row: {
        id: undefined
      },
      showExtend: false,
      amount: 0,
      is_important: false,
      exceed_price: true,
      anytime_bid: false,
      auctionVisible: false,
      loadingSaveBtn: false
    }
  },
  methods: {
    initDialog(row) {
      this.amount = 0
      this.is_important = false
      this.auctionVisible = true
      this.row = row
      if (this.isAuctioned()) {
        this.amount = row.order.max_price
        this.is_important = row.order.is_important
        this.exceed_price = row.order.exceed_price
        this.anytime_bid = row.order.anytime_bid
      }
    },
    isAuctioned() { // 是否已委托
      if (this.row.order) {
        if (!this.row.order.cancel) {
          return true
        }
      }
      return false
    },
    createData() {
      if (this.amount === undefined || this.amount <= 0) {
        this.$message({
          message: '请输入正确的出价',
          type: 'warning'
        })
        return
      }
      this.loadingSaveBtn = true
      addAuction({ order_id: this.row.order_id,
        is_important: this.is_important,
        exceed_price: this.exceed_price,
        anytime_bid: this.anytime_bid,
        amount: parseFloat(this.amount)
      }).then(response => {
        this.loadingSaveBtn = false
        this.$message({
          message: '委托成功!',
          type: 'success'
        })
        this.auctionVisible = false
      }).catch(error => {
        this.loadingSaveBtn = false
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    }
  }
}
</script>
<style>
  code {
    background: #eef1f6;
    padding: 15px 16px;
    margin-bottom: 10px;
    display: block;
    line-height: 36px;
    font-size: 13px;
    font-family: Source Sans Pro,Helvetica Neue,Arial,sans-serif;
  }
  .sm-p {
    display: inline;
    font-size: 13px;
  }
  .check-label {
    font-size: 12px;
    color: #606266;
  }
</style>
