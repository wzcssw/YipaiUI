<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" :placeholder="'销售编号'" prefix-icon="el-icon-document" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" :placeholder="'库房'" prefix-icon="el-icon-document" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" :placeholder="'开始时间'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" :placeholder="'结束时间'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" :placeholder="'商品分类'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.phone" :placeholder="'商品名称'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>
    <!-- height="440" -->
    <el-table ref="mainTable" v-loading="listLoading" :data="list" :height="tableHeight" element-loading-text="加载中" border stripe>
      <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
      <el-table-column prop="group.name" show-overflow-tooltip label="机构" />
      <el-table-column prop="order_id" show-overflow-tooltip width="136" label="销售编号" />
      <el-table-column :label="'销售品类'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ showClassfies(scope.row.classifies) }}
        </template>
      </el-table-column>
      <el-table-column prop="reference_price" show-overflow-tooltip label="新品参考价" />
      <el-table-column prop="start_price" show-overflow-tooltip label="起拍价" />
      <el-table-column :label="'开始时间'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.start_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column :label="'开始时间'" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.end_time | dateFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="description" show-overflow-tooltip label="销售说明" />
      <el-table-column :label="''" align="center" class-name="small-padding fixed-width-me">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleFilter(scope.row)">委托</el-button>
          <div class="division" />
          <el-button type="text" size="mini" @click="handleFilter(scope.row)">导出</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

  </div>
</template>

<script>
import { getDetails } from '@/api/jdXjx'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'XjxListTable',
  components: { Pagination },
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
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        phone: ''
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
      getDetails(this.listQuery).then(response => {
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
    showClassfies(classifies) {
      const result = []
      classifies.forEach(value => result.push(value.name))
      return result.join('、')
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
