<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" :placeholder="'用户名'" prefix-icon="el-icon-document" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.realname" :placeholder="'真实姓名'" prefix-icon="el-icon-document" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" :placeholder="'电话'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table ref="mainTable" v-loading="listLoading" :data="list" :height="tableHeight" element-loading-text="加载中" border stripe>
      <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
      <el-table-column prop="username" show-overflow-tooltip label="用户名" />
      <el-table-column prop="realname" show-overflow-tooltip label="真实姓名" />
      <el-table-column prop="password" show-overflow-tooltip label="密码" />
      <el-table-column prop="phone" show-overflow-tooltip label="电话" />
      <el-table-column prop="email" show-overflow-tooltip label="邮箱" />
      <el-table-column :label="'上次登录'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.last_login | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="'注册时间'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.created_at | dateFormatD }}
        </template>
      </el-table-column>
      <el-table-column :label="'状态'" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusFilterZH }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="''" align="center" class-name="small-padding fixed-width-me">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <div class="division" />
          <el-button type="text" size="mini" @click="handlePermission(scope.row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="editUserTitle + '用户'" :visible.sync="editUserVisiable" width="500px" @close="closeDialog">
      <div class="box-item" style="margin-left: 30px;">
        <el-form ref="editUserForm" :rules="editUserRules" :model="editUser" label-position="left" label-width="100px">
          <el-form-item v-show="false" :label="'id'" prop="id">
            <el-input v-model="editUser.id" />
          </el-form-item>
          <el-form-item :label="'用户名'" prop="username">
            <el-input v-model="editUser.username" :placeholder="'用户名'" style="width: 250px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'真实姓名'" prop="realname">
            <el-input v-model="editUser.realname" :placeholder="'真实姓名'" style="width: 250px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'密码'" prop="password">
            <el-input v-model="editUser.password" :placeholder="'密码'" style="width: 250px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'电话'" prop="phone">
            <el-input v-model="editUser.phone" :placeholder="'电话'" style="width: 250px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'邮箱'" prop="email">
            <el-input v-model="editUser.email" :placeholder="'邮箱'" style="width: 250px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'启用'" prop="email">
            <el-switch v-model="editUser.status" :active-value="0" :inactive-value="1" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserVisiable = false">取消</el-button>
        <el-button :loading="editUserLoading" type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

    <!-- 权限控制 -->
    <permissionDialog ref="permissionDialog" />

  </div>
</template>

<script>
import { getUsers, addUser, updateUser } from '@/api/user'
import permissionDialog from './permissionDialog'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'UsersTable',
  components: { Pagination, permissionDialog },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
      }
      return statusMap[status]
    },
    statusFilterZH(status) {
      const statusMap = {
        0: '启用',
        1: '禁用'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      editUserLoading: false,
      editUserVisiable: false,
      editUserTitle: '',
      editUser: {
        id: undefined,
        username: undefined,
        password: undefined,
        realname: undefined,
        email: undefined,
        phone: undefined,
        status: undefined
      },
      listQuery: {
        page: 1,
        limit: 15,
        username: '',
        realname: '',
        phone: ''
      },
      tableHeight: 440,
      pageSizesList: [15, 30, 45, 60, 200],
      editUserRules: {
        username: [{ required: true, message: '必填项', trigger: 'blur' }],
        realname: [{ required: true, message: '必填项', trigger: 'blur' }],
        password: [{ required: true, message: '必填项', trigger: 'blur' }],
        email: [{ required: true, message: '必填项', trigger: 'blur' }],
        phone: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    setTimeout(() => { // 计算表高度
      this.tableHeight = window.innerHeight - 250
    }, 100)
  },
  methods: {
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
        this.listLoading = false
        this.total = response.total
        this.list = response.data
      }).catch(error => {
        this.listLoading = false
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    },
    handlePermission(row) {
      this.$refs.permissionDialog.initDialog('user', row)
    },
    handleEdit(row) {
      if (row) {
        this.editUser = row
        this.editUserTitle = '编辑'
      } else {
        this.editUser = {
          id: undefined,
          username: undefined
        }
        this.editUserTitle = '新增'
      }
      this.editUserVisiable = true
    },
    indexMethod(index) {
      return (index + 1)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    closeDialog() {
      this.$nextTick(() => {
        this.$refs.editUserForm.clearValidate()
      })
      this.getList()
    },
    createData() {
      this.$refs.editUserForm.validate(valid => {
        if (valid) {
          this.editUserLoading = true
          if (this.editUser.id) { // update
            updateUser(this.editUser).then(response => {
              this.editUserLoading = false
              this.editUserVisiable = false
              this.getList()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }).catch(error => {
              this.editUserLoading = false
              this.$message({
                message: error.data.message,
                type: 'warning'
              })
            })
          } else { // add
            addUser(this.editUser).then(response => {
              this.editUserLoading = false
              this.editUserVisiable = false
              this.getList()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }).catch(error => {
              this.editUserLoading = false
              this.$message({
                message: error.data.message,
                type: 'warning'
              })
            })
          }
        }
      })
    }
  }
}
</script>
<style>
  .el-button--mini {
    padding: 0px 0px;
    font-size: 12px;
    border-radius: 3px;
  }
  .division {
    display: inline;
    margin: 0 4px 0 2px;
    border-left : 1px solid rgba(130, 129, 129, 0.406);
  }
  .short-input {
    width: 160px;
  }
  @media screen and (max-width: 1000px) {
    body {
        background-color:lightblue;
    }
  }
</style>
