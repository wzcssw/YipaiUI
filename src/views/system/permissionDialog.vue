<template>
  <div>
    <el-drawer :visible.sync="dialogVisiable" title="权限控制" direction="rtl" size="600px">
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiable = false">关闭</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script>
// import { getGroups } from '@/api/group'
import waves from '@/directive/waves'

export default {
  name: 'PermissionDialog',
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      dialogVisiable: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // getGroups(this.listQuery).then(response => {
      //   this.listLoading = false
      //   this.total = response.total
      //   this.list = response.data
      // }).catch(error => {
      //   this.listLoading = false
      //   this.$message({
      //     message: error.data.message,
      //     type: 'warning'
      //   })
      // })
    },
    indexMethod(index) {
      return (index + 1)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    createData() {

    },
    initDialog() {
      this.dialogVisiable = true
    }
  }
}
</script>
