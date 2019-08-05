<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.order_id" :placeholder="'订单编号'" prefix-icon="el-icon-document" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.name" :placeholder="'商品名称'" style="width: 180px;" clearable class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-circle-plus" @click="handleCreateSelfOrder">新增订单</el-button>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="加载中" border stripe>
      <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
      <el-table-column prop="company_name" show-overflow-tooltip label="机构" />
      <el-table-column :label="'订单编号'" width="132">
        <template slot-scope="scope">
          <span class="link-type" @click="handleDetail(scope.row)">{{ scope.row.order_id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sale_categories" show-overflow-tooltip label="销售品类" />
      <el-table-column :label="'开始时间'">
        <template slot-scope="scope">
          <span>{{ scope.row.start_at }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="'结束时间'">
        <template slot-scope="scope">
          <span>{{ scope.row.real_end_at }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="total_goods_ceil" show-overflow-tooltip label="售价/起拍价" />
      <el-table-column prop="description" show-overflow-tooltip label="销售说明" min-width="180" />
      <el-table-column :label="''" align="center" class-name="small-padding fixed-width-me">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.shelves" size="mini" type="default" icon="el-icon-warning" @click="handleShelves(scope.row, '')">未上架</el-button>
          <el-button v-if="!scope.row.verified && scope.row.shelves" size="mini" type="primary" icon="el-icon-view" @click="handleUnshelves(scope.row)">审核中</el-button>
          <el-button v-if="scope.row.verified && scope.row.shelves && !scope.row.time_out" size="mini" type="success" icon="el-icon-success" @click="handleUnshelves(scope.row)">已上架</el-button>
          <el-button v-if="scope.row.verified && scope.row.shelves && scope.row.time_out" size="mini" type="info" icon="el-icon-warning" @click="handleShelves(scope.row, '重新')">已失效</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :page-sizes="pageSizesList" @pagination="getList" />

    <!-- 编辑商品 modal -->
    <el-dialog :title="goodsDialogTitle" :visible.sync="goodsDialogVisiable" width="430px">
      <div class="box-item" style="margin-left: 20px;">
        <el-form ref="goodsObjForm" :rules="goodsObjRules" :model="goodsObj" label-position="left" label-width="100px">
          <!-- <el-form-item :label="'ID'" prop="id">
            <el-input v-model="goodsObj.id" :placeholder="'id'" style="width: 220px;" class="filter-item" clearable/>
          </el-form-item> -->
          <el-form-item :label="'商品名称'" prop="goods_name">
            <el-input v-model="goodsObj.goods_name" :disabled="change_disabled" :placeholder="'商品名称'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'数量'" prop="goods_count">
            <el-input v-model="goodsObj.goods_count" :placeholder="'数量'" type="number" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'成色'" prop="goods_color">
            <el-input v-model="goodsObj.goods_color" :placeholder="'成色'" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'售价/起拍价'" prop="goods_ceilcount">
            <el-input v-model="goodsObj.goods_ceilcount" :placeholder="'售价/起拍价'" type="number" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
          <el-form-item :label="'新品链接'" prop="link">
            <el-input v-model="goodsObj.link" :placeholder="'新品链接'" type="textarea" style="width: 220px;" class="filter-item" clearable />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :disabled="goodsSaveLoading" @click="goodsDialogVisiable = false">{{ $t('modal.cancel') }}</el-button>
        <el-button v-waves :loading="goodsSaveLoading" type="primary" @click="createGoodsData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 选择订单类型 modal -->
    <el-dialog :title="''" :visible.sync="chooseDialogVisible" width="430px">
      <div class="box-item" style="height: 250px;">
        <div style="display: block;position: absolute;left: 112px;top: 152px;">
          <el-button v-waves size="180" type="primary" round @click="createSelfOrderModal('渠道商')">出售单</el-button>
          <el-button v-waves size="180" type="success" round style="margin-left: 30px" @click="createSelfOrderModal('求购单')">求购单</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 新增订单 modal -->
    <el-dialog :title="atitude() + handleGetCompanyNameTitle()" :visible.sync="detailDialogFormVisible" width="1000px" @close="closeModal">
      <el-card shadow="never">
        <table class="detail-table" style="width: 980px;">
          <tr>
            <td>品类:</td>
            <td>
              <el-input v-model="detail.sale_categories" size="small" placeholder="品类" style="width: 180px" clearable />
            </td>
            <td>地区:</td>
            <td>
              <el-input v-model="detail.address" size="small" placeholder="地区" style="width: 180px" clearable />
            </td>
            <td>销售说明:</td>
            <td rowspan="2" style="vertical-align: top">
              <el-select v-model="descriptionArray" size="small" style="margin-top: 2px;width: 330px" multiple filterable allow-create default-first-option placeholder="(可勾选和手动输入)">
                <el-option v-for="item in tagOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </td>
          </tr>
          <tr>
            <td>联系人:</td>
            <td>
              <el-input v-model="detail.contact" size="small" placeholder="联系人" style="width: 180px" clearable />
            </td>
            <td>电话:</td>
            <td>
              <el-input v-model="detail.phone" size="small" placeholder="电话" style="width: 180px" clearable />
            </td>
            <td />
            <!-- <td/> -->
          </tr>
        </table>
      </el-card>
      <div style="margin-top: 25px">
        <el-button v-waves class="filter-item" type="primary" size="small" icon="el-icon-circle-plus" plain @click="handleAddGoods">添加商品</el-button>
        <el-button v-waves class="filter-item" type="default" size="small" icon="el-icon-upload" @click="uploadExcel">上传Excel</el-button>
        <input ref="uploadExcel" style="display: none" type="file" @change="handleUploadExcelChange">
        <a style="font-size: 12px;margin-left: 10px;color: #409EFF" @click="downloadDemo">
          <i class="el-icon-download">下载{{ handleGetCompanyNameTitle() }}模版</i>
        </a>
      </div>
      <el-table v-loading="listTopLoading" :data="detail.order_goods" max-height="250" element-loading-text="加载中" border stripe style="margin-top: 10px">
        <!-- <el-table-column prop="goods_code" show-overflow-tooltip label="二手编码" width="110px"/> -->
        <el-table-column :label="'序号'" :index="indexMethod" width="50" type="index" />
        <el-table-column prop="goods_name" show-overflow-tooltip label="商品名称" min-width="340px" />
        <el-table-column prop="goods_count" show-overflow-tooltip label="数量" />
        <el-table-column prop="goods_color" show-overflow-tooltip label="成色" min-width="120px" />
        <el-table-column prop="goods_ceilcount" show-overflow-tooltip width="100px" label="售价/起拍价" />
        <el-table-column :label="'新品链接'" align="center" class-name="small-padding fixed-width-me">
          <template slot-scope="scope">
            <a v-if="scope.row.link" style="color: #409EFF;font-size: 12px" @click="jump(scope.row.link)">
              <svg-icon icon-class="link" /> 跳转
            </a>
            <span v-if="!scope.row.link">--</span>
          </template>
        </el-table-column>
        <el-table-column :label="''" align="center" class-name="small-padding fixed-width-me">
          <template slot-scope="scope">
            <a style="color: #409EFF;font-size: 12px" @click="handleUpdateGoods(scope.row)">修改</a>
            <span style="color: #909399">|</span>
            <a style="color: #909399;font-size: 12px" @click="removeGoods(scope.row)">移除</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 上传图片 start -->
      <el-upload
        ref="upload_image"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleUploadSuccess"
        :before-upload="handleBeforeUpload"
        :file-list="uploadImageList"
        action="/api/self_orders/upload_file"
        list-type="picture-card"
        style="margin-top: 25px"
      >
        <div style="font-size: 12px;margin-top: 3px">点击上传商品图片</div>
      </el-upload>
      <el-dialog :modal-append-to-body="false" :visible.sync="uploadDialogVisible" width="500px">
        <img :src="dialogImageUrl" width="100%">
      </el-dialog>
      <!-- 上传图片 end -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailDialogFormVisible = false">关闭</el-button>
        <el-button v-waves :loading="saveLoading" type="primary" @click="saveSelfOrder">保存</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getSelfOrders } from '@/api/selfOrder'
import { saveSelfOrders } from '@/api/selfOrder'
import { updateStatus } from '@/api/selfOrder'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import axios from 'axios'
import { setUserInfo, getUserInfo } from '@/utils/auth'

export default {
  name: 'UsersTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        Bare: 'info',
        OS: 'success',
        Installing: 'default',
        Installed: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      classifyList: [],
      descriptionArray: [],
      dialogImageUrl: '',
      uploadDialogVisible: false,
      tagOptions: ['含税', '包邮', '支持拆单', '一口价模式', '竞拍模式'],
      uploadImageList: [],
      goodsDialogVisiable: false,
      goodsDialogTitle: '',
      saveLoading: false,
      change_disabled: false,
      listLoading: true,
      chooseDialogVisible: false,
      listCombinationoldLoading: false,
      listTopLoading: false,
      goodsSaveLoading: false,
      total: 0,
      SaleCategoryOptions: [],
      goodsObj: {
        goods_name: undefined,
        goods_count: undefined,
        goods_color: undefined,
        goods_ceilcount: undefined,
        link: undefined
      },
      listQuery: {
        page: 1,
        limit: 15,
        startAt: 'today',
        order_id: undefined,
        name: undefined,
        classify_id: undefined
      },
      listCombinationold: [],
      listTop: [],
      selectedObject: {
        ceilingAmount: '',
        currentBidderAmount: '',
        description: '',
        id: undefined,
        orderId: '',
        realEndAt: '',
        set_status: '',
        startAmount: '',
        startAt: ''
      },
      pageSizesList: [15, 30, 45, 60, 200],
      indexMethod(index) {
        return (index + 1)
      },
      dialogFormVisible: false,
      detailDialogFormVisible: false,
      temp: {
        ipmi_user: 'admin',
        ipmi_password: 'admin',
        ipmi_ip: '',
        ipmi_port: '623',
        mac: undefined,
        brand: undefined
      },
      tempRules: {
        ipmi_user: [{ required: true, message: 'ipmi_user is required', trigger: 'change' }],
        ipmi_password: [{ required: true, message: 'ipmi_password is required', trigger: 'change' }],
        ipmi_ip: [{ required: true, message: 'ipmi_ip is required', trigger: 'change' }],
        ipmi_port: [{ required: true, message: 'ipmi_port is required', trigger: 'change' }],
        brand: [{ required: true, message: 'brand is required', trigger: 'blur' }]
      },
      detail: {
        company_name: undefined,
        sale_categories: '',
        address: '',
        contact: '',
        phone: '',
        order_goods: []
      },
      msgDetail: {},
      goodsObjRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'change' }],
        goods_count: [{ required: true, message: '请输入数量', trigger: 'change' }],
        goods_ceilcount: [{ required: true, message: '请输入售价/起拍价', trigger: 'change' }],
        goods_color: [{ required: true, message: '请输入成色', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getSelfOrders(this.listQuery).then(response => {
        this.listLoading = false
        this.total = response.total
        this.list = response.list
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDetail(row) {
      this.detail = row
      this.descriptionArray = this.detail.description.split(',')
      for (let i = 0; i < this.detail.file_resources.length; i++) {
        this.uploadImageList.push({ name: this.detail.file_resources[i].original_name,
          original_name: this.detail.file_resources[i].original_name,
          file_name: this.detail.file_resources[i].file_name,
          url: '/api/self_orders/download_file?file_name=' + this.detail.file_resources[i].file_name })
      }
      this.detailDialogFormVisible = true
    },
    resetGoodsTemp() {
      this.goodsObj = {
        goods_name: undefined,
        goods_count: undefined,
        goods_color: undefined,
        goods_ceilcount: undefined
      }
    },
    resetDetail() {
      this.detail = {
        company_name: undefined,
        sale_categories: '',
        address: '',
        contact: '',
        phone: '',
        description: '',
        order_goods: []
      }
    },
    handleCreateSelfOrder() {
      this.chooseDialogVisible = true
    },
    createSelfOrderModal(company_name) {
      this.resetDetail()
      this.descriptionArray = []
      this.detail.company_name = company_name
      this.detailDialogFormVisible = true
      this.chooseDialogVisible = false
      // 写入默认值
      const userInfoCookie = this.getDefaultContact()
      this.detail.contact = userInfoCookie.contact
      this.detail.phone = userInfoCookie.phone
      this.detail.address = userInfoCookie.address
    },
    handleGetCompanyNameTitle() {
      const result = this.detail.company_name
      if (this.detail.company_name === '渠道商') {
        return '出售单'
      }
      return result
    },
    handleRemove(file, fileList) {
      this.uploadImageList.splice(this.uploadImageList.findIndex(item => item.file_name === file.file_name), 1)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.uploadDialogVisible = true
    },
    handleAddGoods() {
      this.resetGoodsTemp()
      this.$nextTick(() => {
        this.$refs['goodsObjForm'].clearValidate()
      })
      this.change_disabled = false
      this.goodsDialogTitle = '新增商品'
      this.goodsDialogVisiable = true
    },
    createGoodsData() {
      this.$refs['goodsObjForm'].validate((valid) => {
        if (valid) {
          if (this.goodsDialogTitle === '新增商品') {
            this.detail.order_goods.push(this.goodsObj)
          } else {
            const _this = this
            const obj = this.detail.order_goods.find(function(x) {
              return x.goods_name === _this.goodsObj.goods_name
            })
            obj.goods_name = this.goodsObj.goods_name
            obj.goods_count = this.goodsObj.goods_count
            obj.goods_color = this.goodsObj.goods_color
            obj.goods_ceilcount = this.goodsObj.goods_ceilcount
            obj.link = this.goodsObj.link
          }
          this.goodsDialogVisiable = false
        }
      })
    },
    handleUpdateGoods(row) {
      this.resetGoodsTemp()
      this.$nextTick(() => {
        this.$refs['goodsObjForm'].clearValidate()
      })
      this.change_disabled = true
      const str = JSON.stringify(row)
      this.goodsObj = JSON.parse(str) // copy object
      this.goodsDialogTitle = '编辑商品'
      this.goodsDialogVisiable = true
    },
    removeGoods(row) {
      this.detail.order_goods.splice(this.detail.order_goods.findIndex(item => item.goods_name === row.goods_name), 1)
    },
    uploadExcel() {
      this.$refs.uploadExcel.click()
    },
    handleUploadExcelChange(e) {
      e.preventDefault()
      const files = e.target.files || e.dataTransfer.files
      const data = new FormData()
      data.append('file', files[0])
      data.append('type', this.detail.company_name)
      axios.post('/api/self_orders/read_excel', data, {
        headers: {
          'token': this.$store.getters.token
        }
      }).then(res => {
        this.detail.order_goods.push(...res.data.data)
      }).catch(err => {
        this.$message({
          message: err.response.data.msg,
          type: 'error'
        })
      })
    },
    closeModal() {
      this.clearModelsImage()
      this.uploadImageList = []
      this.getList()
    },
    downloadDemo() {
      window.open('/api/self_orders/download_demo?type=' + this.detail.company_name)
    },
    handleUploadSuccess(res, file) {
      console.log(file.name)
      console.log(file.response.file_name)
      this.uploadImageList.push({ name: file.name,
        original_name: file.name,
        file_name: file.response.file_name,
        url: '/api/self_orders/download_file?file_name=' + file.response.file_name })
    },
    valid() {
      console.log(this.detail)
      let result = true
      if (this.detail.sale_categories === '') {
        this.$message.error('品类不能为空')
        result = false
      }
      if (this.detail.address === '') {
        this.$message.error('地区不能为空')
        result = false
      }
      if (this.detail.contact === '') {
        this.$message.error('联系人不能为空')
        result = false
      }
      if (this.detail.phone === '') {
        this.$message.error('电话不能为空')
        result = false
      }
      if (this.descriptionArray.length < 1) {
        this.$message.error('销售说明不能为空')
        result = false
      }
      if (this.detail.order_goods.length < 1) {
        this.$message.error('请至少添加一条商品信息')
        result = false
      }
      return result
    },
    handleBeforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是JPG或PNG格式!')
      }
      return isJPG || isPNG
    },
    saveSelfOrder() {
      if (this.valid()) {
        this.saveDefaultContact(this.detail.contact, this.detail.phone, this.detail.address)
        if (this.detail.verified) {
          this.$confirm('修改上架内容需要重新审核，是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.saveLoading = true
            this.detail.description = this.descriptionArray.join(',')
            this.detail.file_resources = this.uploadImageList
            saveSelfOrders({ data: JSON.stringify(this.detail) }).then(response => {
              this.saveLoading = false
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.detailDialogFormVisible = false
              this.getList()
            }).catch(err => {
              return err
            })
          })
        } else {
          this.saveLoading = true
          this.detail.description = this.descriptionArray.join(',')
          this.detail.file_resources = this.uploadImageList
          saveSelfOrders({ data: JSON.stringify(this.detail) }).then(response => {
            this.saveLoading = false
            this.$message({
              message: response.msg,
              type: 'success'
            })
            this.detailDialogFormVisible = false
            this.getList()
          })
        }
      }
    },
    atitude() {
      if (this.detail.id === undefined) {
        return '新建'
      }
      return '更新'
    },
    clearModelsImage() {
      this.$refs['upload_image'].clearFiles()
    },
    handleShelves(row, title) {
      this.$confirm('确定要' + title + '上架此条目吗？', '提示', {
        confirmButtonText: '上架',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        updateStatus({ id: row.id, shelves: true }).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '上架成功!'
          })
        }).catch(err => {
          this.$message({ message: err.response.message, type: 'error' })
        })
      })
    },
    handleUnshelves(row) {
      this.$confirm('确定要下架此条目吗？', '提示', {
        confirmButtonText: '下架',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        updateStatus({ id: row.id, shelves: false }).then(response => {
          this.getList()
          this.$message({
            type: 'success',
            message: '下架成功!'
          })
        }).catch(err => {
          this.$message({ message: err.response.message, type: 'error' })
        })
      })
    },
    saveDefaultContact(contact, phone, address) {
      setUserInfo('userInfoContactKey', contact)
      setUserInfo('userInfoPhoneKey', phone)
      setUserInfo('userInfoAddressKey', address)
    },
    getDefaultContact() {
      const result = {
        contact: '',
        phone: '',
        address: ''
      }
      if (getUserInfo('userInfoContactKey') !== 'undefined') {
        result.contact = getUserInfo('userInfoContactKey')
      }
      if (getUserInfo('userInfoPhoneKey') !== 'undefined') {
        result.phone = getUserInfo('userInfoPhoneKey')
      }
      if (getUserInfo('userInfoAddressKey') !== 'undefined') {
        result.address = getUserInfo('userInfoAddressKey')
      }
      return result
    },
    jump(link) {
      window.open(link)
    }
  }
}
</script>
<style>
    .fixed-width-me .el-button--mini {
        padding: 7px 10px;
        width: 91px;
    }
    .select-width {
        width: 280px;
    }
    .el-card__header{
        background-color: #EBEEF5;
    }
    .head-font-size {
        font-size: 15px;
    }
    .back-word{
      font-weight: 500;
      color: #4F4F4F;
    }
    .detail-table tr {
        height: 40px;
    }
    .detail-table td {
        color: #606266;
    }
    .el-card__body {
        padding: 15px;
    }
</style>
