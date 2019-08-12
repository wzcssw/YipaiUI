<template>
  <!-- 修改密码 modal -->
  <el-dialog :title="'修改密码'" :visible.sync="updatePwdDialogVisable" width="430px">
    <div class="box-item" style="margin-left: 20px;">
      <el-form ref="pwdObjForm" :rules="pwdObjRules" :model="pwdObj" label-position="left" label-width="100px">
        <el-form-item :label="'原密码'" prop="old_password">
          <el-input v-model="pwdObj.old_password" :placeholder="'原密码'" type="password" style="width: 220px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item :label="'新密码'" prop="new_password">
          <el-input v-model="pwdObj.new_password" :placeholder="'新密码'" type="password" style="width: 220px;" class="filter-item" clearable />
        </el-form-item>
        <el-form-item :label="'重复新密码'" prop="repeat_password">
          <el-input v-model="pwdObj.repeat_password" :placeholder="'重复新密码'" type="password" style="width: 220px;" class="filter-item" clearable />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="updatePwdDialogVisable = false">取消</el-button>
      <el-button :loading="updatePwdDialogLoading" type="primary" @click="handleChangePassword()">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import waves from '@/directive/waves'
import { updatePassword } from '../api/user'

export default {
  name: 'UpdatePwd',
  directives: { waves },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少需要六位字符'))
      } else {
        callback()
      }
    }
    return {
      updatePwdDialogVisable: false,
      updatePwdDialogLoading: false,
      pwdObj: {
        old_password: undefined,
        new_password: undefined,
        repeat_password: undefined
      },
      pwdObjRules: {
        old_password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        new_password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        repeat_password: [{ required: true, message: '请重复输入新密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    initUpdatePwdDialog() {
      this.pwdObj = {
        old_password: undefined,
        new_password: undefined,
        repeat_password: undefined
      }
      this.updatePwdDialogVisable = true
      this.updatePwdDialogLoading = false
    },
    handleChangePassword() {
      this.updatePwdDialogLoading = true
      if (this.pwdObj.new_password !== this.pwdObj.repeat_password) {
        this.$message({
          message: '两次密码输入不一致',
          type: 'warning'
        })
        return
      }
      updatePassword(this.pwdObj).then(response => {
        this.updatePwdDialogLoading = false
        this.$message({
          message: '操作成功!',
          type: 'success'
        })
        this.updatePwdDialogVisable = false
      }).catch(error => {
        this.updatePwdDialogLoading = false
        this.$message({
          message: error.data.message,
          type: 'warning'
        })
      })
    }
  }
}
</script>
