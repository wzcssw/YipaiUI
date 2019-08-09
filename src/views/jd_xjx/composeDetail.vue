<template>
  <el-dialog :title="'竞销详情'" :visible.sync="composeDialogVisible" width="1230px">
    <table id="detail_table" style="width: 1100px;">
      <tr>
        <td class="table_head">订单编号:</td>
        <td class="back-word">{{ row.order_id }}</td>
        <td class="table_head">销售品类:</td>
        <td class="back-word">{{ showClassfies(row.classifies) }}</td>
        <td class="table_head">所在机构:</td>
        <td class="back-word">{{ row.group.name }}</td>
      </tr>
      <tr>
        <td class="table_head">联系人:</td>
        <td class="back-word">{{ row.contact }}</td>
        <td class="table_head">联系电话:</td>
        <td class="back-word">{{ row.tel }}</td>
        <td class="table_head">销售说明:</td>
        <td class="back-word">{{ showSimple(row.description) }}</td>
      </tr>
      <tr>
        <td class="table_head">提货地点:</td>
        <td class="back-word">{{ row.address }}</td>
        <td class="table_head">起拍金额:</td>
        <td class="back-word">{{ row.start_price }}</td>
        <td class="table_head">新品参考价:</td>
        <td class="back-word">{{ row.reference_price }}</td>
      </tr>
    </table>
    <h4>组合详情</h4>
    <el-table v-loading="loadingCompose" :data="listCompose" max-height="350" element-loading-text="加载中" border stripe style="margin-top: 10px">
      <el-table-column :label="'二手编码'" width="150">
        <template slot-scope="scope">
          <span class="link-type" @click="handleRedirect(scope.row)">{{ scope.row.code_id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="商品名称" />
      <el-table-column prop="num" show-overflow-tooltip label="数量" width="50" />
      <el-table-column prop="color" show-overflow-tooltip label="成色" width="70" />
      <el-table-column prop="discount" show-overflow-tooltip label="真实折扣" width="80" />
      <el-table-column prop="price" show-overflow-tooltip label="红字价" width="76" />
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="composeDialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getComposes } from '@/api/jdXjx'

export default {
  data() {
    return {
      row: {
        order_id: undefined,
        classifies: undefined,
        group: {
          name: undefined
        },
        contact: undefined,
        tel: undefined,
        description: undefined,
        address: undefined,
        start_price: undefined,
        reference_price: undefined
      },
      listCompose: [],
      loadingCompose: false,
      composeDialogVisible: false
    }
  },
  methods: {
    initDialog(row) {
      this.composeDialogVisible = true
      this.row = row

      this.loadingCompose = true
      getComposes({ detail_id: row.id }).then(response => {
        this.loadingCompose = false
        this.listCompose = response.data
      }).catch(error => {
        this.loadingCompose = false
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    },
    showClassfies(classifies) {
      const result = []
      if (classifies) {
        classifies.forEach(value => result.push(value.name))
      }
      return result.join('、')
    },
    handleRedirect(row) {
      const codeID = row.code_id + ''
      const str = codeID.substr(0, codeID.length - 4)
      window.open('https://item.jd.com/' + str + '.html')
    },
    showSimple(value) {
      if (!value) return ''
      if (value.length > 14) {
        return value.slice(0, 14) + '...'
      }
      return value
    }
  }
}
</script>
