<template>
  <el-dialog :title="'委托'" :visible.sync="auctionVisible" width="430px">
    <div class="box-item">
      <span class="field-label">最高出价:</span>
      <el-input v-model="amount" :placeholder="'最高出价'" type="number" style="width: 180px;margin-left: 15px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-checkbox v-model="isImportant " style="margin-left: 10px">
        <span style="font-size: 12px;color: #606266">标记重点单</span>
      </el-checkbox>
      <div style="margin-top: 25px">
        <p class="sm-p">销售编号: {{ row.order_id }}</p>
        <p class="sm-p" style="margin-left: 25px">新品参考价: {{ row.reference_price }}</p>
      </div>
      <code style="margin-top:15px;">*最大出价即预计竞拍此商品的最大出价值，我们会为你定时以此为参考抢购</code>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="auctionVisible = false">取消</el-button>
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
      amount: undefined,
      isImportant: false,
      auctionVisible: false,
      loadingSaveBtn: false
    }
  },
  methods: {
    initDialog(row) {
      this.amount = undefined
      this.isImportant = false
      this.auctionVisible = true
      this.row = row
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
      addAuction({ detail_id: this.row.id, isImportant: this.isImportant }).then(response => {
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
    margin-bottom: 20px;
    display: block;
    line-height: 36px;
    font-size: 13px;
    font-family: Source Sans Pro,Helvetica Neue,Arial,sans-serif;
  }
  .sm-p {
    display: inline;
    font-size: 13px;
  }
</style>
