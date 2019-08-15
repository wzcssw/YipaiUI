<template>
  <div>
    <el-dialog :title="'权限组'" :visible.sync="groupVisiable" width="920px">
      <el-table ref="groupTable" v-loading="listLoading" :data="list" element-loading-text="加载中" border stripe>
        <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
        <el-table-column prop="name" show-overflow-tooltip label="组名" />
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
      <div slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" icon="el-icon-circle-plus" @click="handleEdit()">新增组</el-button>
        <el-button @click="groupVisiable = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog :title="editGroupTitle + '权限组'" :visible.sync="editGroupVisiable" width="430px">
      <div class="box-item" style="margin-left: 30px;">
        <el-form ref="editGroupForm" :rules="editGroupRules" :model="editGroup" label-position="left" label-width="50px">
          <el-form-item v-show="false" :label="'id'" prop="id">
            <el-input v-model="editGroup.id" />
          </el-form-item>
          <el-form-item :label="'名称'" prop="name">
            <el-input v-model="editGroup.name" :placeholder="'名称'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'备注'" prop="remark">
            <el-input v-model="editGroup.remark" :placeholder="'备注'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGroupVisiable = false">取消</el-button>
        <el-button :loading="editGroupLoading" type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getGroups } from '@/api/group'
import { addGroup } from '@/api/group'
import { updateGroup } from '@/api/group'
import waves from '@/directive/waves'

export default {
  name: 'GroupTable',
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      groupVisiable: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        remark: ''
      },
      pageSizesList: [15, 30, 45, 60, 200],
      editGroup: {
        id: undefined,
        name: undefined,
        remark: undefined
      },
      editLoading: false,
      editGroupVisiable: false,
      editGroupLoading: false,
      editGroupTitle: '',
      editGroupRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGroups(this.listQuery).then(response => {
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
    createData() {
      this.editGroupLoading = true
      if (this.editGroup.id) { // update
        updateGroup(this.editGroup).then(response => {
          this.editGroupLoading = false
          this.editGroupVisiable = false
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(error => {
          this.editGroupLoading = false
          this.$message({
            message: error.data.message,
            type: 'warning'
          })
        })
      } else { // add
        addGroup(this.editGroup).then(response => {
          this.editGroupLoading = false
          this.editGroupVisiable = false
          this.getList()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }).catch(error => {
          this.editGroupLoading = false
          this.$message({
            message: error.data.message,
            type: 'warning'
          })
        })
      }
    },
    handleEdit(row) {
      if (row) {
        this.editGroup = row
        this.editGroupTitle = '编辑'
      } else {
        this.editGroup = {
          id: undefined,
          name: undefined,
          remark: undefined
        }
        this.editGroupTitle = '新增'
      }
      this.editGroupVisiable = true
    },
    initDialog() {
      this.groupVisiable = true
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
