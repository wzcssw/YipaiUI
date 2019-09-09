<template>
  <el-drawer :visible.sync="dialogVisiable" :title="title" direction="rtl" size="600px">
    <div style="margin: 20px">
      <el-tree ref="tree" :data="permissionTree" :props="defaultProps" node-key="value" check-strictly show-checkbox default-expand-all highlight-current />
      <div v-show="showDataLoading" class="loading-bottom">
        <i class="el-icon-loading" />
        载入中..
      </div>
      <div class="drawer-footer">
        <el-button class="footer-btn" type="primary" @click="createData">保存</el-button>
        <el-button class="footer-btn" icon="el-icon-refresh" @click="reload">重置</el-button>
        <el-button class="footer-btn" @click="dialogVisiable = false">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { getPermissionTree, getRolePermissions, updateRolePermissions, getUserPermissions, updateUserPermissions } from '@/api/permission'
import waves from '@/directive/waves'

export default {
  name: 'PermissionDialog',
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      row: {
        id: 0
      },
      title: '',
      type: '',
      dialogVisiable: false,
      saveLoading: false,
      showDataLoading: false, // 回显数据loading
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      permissionTree: undefined
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPermissionTree({}).then(response => {
        this.permissionTree = response.data
      }).catch(error => {
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    },
    setCheckedKeys(row) {
      this.showDataLoading = true
      let checkedMethod = getRolePermissions
      if (this.type === 'user') {
        checkedMethod = getUserPermissions
      }
      checkedMethod({ id: this.row.id, page: 1, limit: -1 }).then(response => {
        this.showDataLoading = false
        this.$refs.tree.setCheckedKeys(response.data.map(v => { return v.id }))
      }).catch(error => {
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    },
    indexMethod(index) {
      return (index + 1)
    },
    createData() {
      this.saveLoading = true
      let updateMethod = updateRolePermissions
      if (this.type === 'user') {
        updateMethod = updateUserPermissions
      }
      updateMethod({ id: this.row.id, permission_ids: this.$refs.tree.getCheckedKeys() }).then(response => {
        this.saveLoading = false
        this.$message({ message: '操作成功', type: 'success' })
        this.dialogVisiable = false
      }).catch(error => {
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    },
    reload() {
      this.getList()
    },
    initDialog(type, row) {
      this.type = type
      if (type === 'role') {
        this.title = '权限 - ' + row.name + ' - ' + row.remark
      } else if (type === 'user') {
        this.title = '权限 - ' + row.username + ' - ' + row.realname
      }
      this.row = row
      this.setCheckedKeys()
      this.dialogVisiable = true
    }
  }
}
</script>
<style>
  .drawer-footer {
    position: fixed;
    bottom: 5px;
  }
  .footer-btn {
    width: 175px;
  }
  .loading-bottom {
    color: #909399;
    font-size: 14px;
    position: fixed;
    bottom: 55px;
  }
</style>
