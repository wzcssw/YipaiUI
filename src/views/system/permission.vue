<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="'角色名'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.remark" :placeholder="'备注'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
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
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

  </div>
</template>

<script>
import { getPermissions } from '@/api/permission'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'PermissionTable',
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
      getPermissions(this.listQuery).then(response => {
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
