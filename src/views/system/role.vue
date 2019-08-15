<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="'角色名'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remark" :placeholder="'备注'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleEdit()">新增</el-button>
    </div>

    <el-table ref="mainTable" v-loading="listLoading" :data="list" :height="tableHeight" element-loading-text="加载中" border stripe>
      <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
      <el-table-column prop="name" show-overflow-tooltip label="角色名" />
      <el-table-column prop="remark" show-overflow-tooltip label="备注" />
      <el-table-column :label="'创建时间'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.created_at | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="'修改时间'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.updated_at | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="''" align="center" class-name="small-padding fixed-width-me">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="editRoleTitle + '角色'" :visible.sync="editRoleVisiable" width="430px">
      <div class="box-item" style="margin-left: 30px;">
        <el-form ref="editRoleForm" :rules="editRoleRules" :model="editRole" label-position="left" label-width="50px">
          <el-form-item v-show="false" :label="'id'" prop="id">
            <el-input v-model="editRole.id" />
          </el-form-item>
          <el-form-item :label="'名称'" prop="name">
            <el-input v-model="editRole.name" :placeholder="'名称'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'备注'" prop="remark">
            <el-input v-model="editRole.remark" :placeholder="'备注'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleVisiable = false">取消</el-button>
        <el-button :loading="editRoleLoading" type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

  </div>
</template>

<script>
import { getRoles } from '@/api/role'
import { addRole } from '@/api/role'
import { updateRole } from '@/api/role'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'RolesTable',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        remark: ''
      },
      tableHeight: 440,
      editRole: {
        id: undefined,
        name: undefined,
        remark: undefined
      },
      editRoleTitle: '',
      editRoleVisiable: false,
      editRoleLoading: false,
      editRoleRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      pageSizesList: [15, 30, 45, 60, 200]
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
      getRoles(this.listQuery).then(response => {
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
    indexMethod(index) {
      return (index + 1)
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleEdit(row) {
      if (row) {
        this.editRole = row
        this.editRoleTitle = '编辑'
      } else {
        this.editRole = {
          id: undefined,
          name: undefined,
          remark: undefined
        }
        this.editRoleTitle = '新增'
      }
      this.editRoleVisiable = true
    },
    createData() {
      this.editRoleLoading = true
      if (this.editRole.id) { // update
        updateRole(this.editRole).then(response => {
          this.editRoleLoading = false
          this.editRoleVisiable = false
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(error => {
          this.editRoleLoading = false
          this.$message({
            message: error.data.message,
            type: 'warning'
          })
        })
      } else { // add
        addRole(this.editRole).then(response => {
          this.editRoleLoading = false
          this.editRoleVisiable = false
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(error => {
          this.editRoleLoading = false
          this.$message({
            message: error.data.message,
            type: 'warning'
          })
        })
      }
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
