<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.order_id" :placeholder="'销售编号'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.group_id" :placeholder="'库房'" clearable class="filter-item short-input" @change="handleFilter">
        <el-option v-for="item in listGroup" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-select v-model="listQuery.startTime" :placeholder="'开始时间'" clearable class="filter-item short-input" @change="handleFilter">
        <el-option v-for="item in startTimeOptions" :key="item.k" :label="item.v" :value="item.k" />
      </el-select>
      <el-select v-model="listQuery.classify_id" :placeholder="'商品分类'" clearable class="filter-item short-input" @change="handleFilter">
        <el-option v-for="item in listClassified" :key="item.code" :label="item.name" :value="item.code" />
      </el-select>
      <el-input v-model="listQuery.name" :placeholder="'商品名称'" clearable class="filter-item short-input" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <el-table ref="mainTable" v-loading="listLoading" :data="list" :height="tableHeight" element-loading-text="加载中" border stripe>
      <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
      <el-table-column prop="group.name" show-overflow-tooltip label="机构" />
      <el-table-column :label="'销售编号'" width="136">
        <template slot-scope="scope">
          <span class="link-type" @click="handleCompose(scope.row)">{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
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
          <el-button type="text" size="mini" @click="handleAuction(scope.row)">委托</el-button>
          <div class="division" />
          <el-button type="text" size="mini" @click="handleExport(scope.row)">导出</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 组合详情 -->
    <composeDetail ref="composeDetail" />

    <!-- 委托 -->
    <auction ref="auction" />

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

  </div>
</template>

<script>
import { getDetails } from '@/api/jdXjx'
import { getDicts } from '@/api/jdXjx'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import composeDetail from './composeDetail'
import auction from './auction'

const startTimeOptions = [
  { k: 'today', v: '今天' },
  { k: 'three', v: '三天内' },
  { k: 'seven', v: '七天内' }
]

export default {
  name: 'XjxListTable',
  components: { Pagination, composeDetail, auction },
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
      listClassified: [],
      listGroup: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: undefined,
        startTime: 'today',
        order_id: undefined,
        group_id: undefined,
        classify_id: undefined
      },
      startTimeOptions: startTimeOptions,
      tableHeight: 440,
      pageSizesList: [15, 30, 45, 60, 200]
    }
  },
  created() {
    this.getList()
    this.getOptions()
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
    getOptions() {
      getDicts({ type: 1 }).then(response => {
        this.listGroup = response.data
      }).catch(error => {
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
      getDicts({ type: 2 }).then(response => {
        this.listClassified = response.data
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCompose(row) {
      this.$refs.composeDetail.initDialog(row)
    },
    handleAuction(row) {
      this.$refs.auction.initDialog(row)
    },
    handleExport(row) {
      window.location.href = '/api/v1/jd_xjx/details/excel?token=' + getToken() + '&detail_id=' + row.id
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
