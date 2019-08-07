<template>
  <div class="login-container">
    <el-form ref="signinFormRef" prop="signinFormRef" :model="signinForm" :rules="signinRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">一拍·集合 | 注册账号</h3>
      </div>
      <el-row style="margin-top: 65px">
        <el-col :span="10">
          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input ref="username" v-model="signinForm.username" placeholder="用户名" name="username" type="text" tabindex="1" autocomplete="on" />
          </el-form-item>

          <el-form-item prop="realname">
            <span class="svg-container">
              <svg-icon icon-class="edit" />
            </span>
            <el-input ref="realname" v-model="signinForm.realname" placeholder="真实姓名" name="realname" type="text" tabindex="1" autocomplete="on" />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="password"
                :key="passwordType"
                v-model="signinForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleSignin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
            <el-form-item prop="passwordRepeat">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                ref="passwordRepeat"
                :key="passwordType"
                v-model="signinForm.passwordRepeat"
                :type="passwordType"
                placeholder="重复密码"
                name="passwordRepeat"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleSignin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
        </el-col>
        <el-col :span="4">
          <div style="height: 251px;margin: 9px 10px 0 78px;width:5px;border-left: solid 1px #ffffff59;" />
        </el-col>
        <el-col :span="10">
          <el-form-item prop="email">
            <span class="svg-container">
              <svg-icon icon-class="email" />
            </span>
            <el-input
              ref="email"
              v-model="signinForm.email"
              placeholder="邮箱"
              name="email"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-form-item prop="phone">
            <span class="svg-container">
              <svg-icon icon-class="phone" />
            </span>
            <el-input
              ref="phone"
              v-model="signinForm.phone"
              placeholder="手机号码"
              name="phone"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-form-item prop="validSms" style="height: 52px">
            <span class="svg-container">
              <svg-icon icon-class="validsms" />
            </span>
            <el-input
              ref="validSms"
              v-model="signinForm.validSms"
              placeholder="短信验证码"
              name="validSms"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
            <a class="get-sms" @click="getValidSms">{{ smsBtnContent }}</a>
          </el-form-item>

          <el-button :loading="loading" type="success" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleSignin">注册</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="footer">
      <span class="footer-words">
        版权所有© ️北京鼎钐科技有限公司 &nbsp; 联系方式：18515450008
      </span>
    </div>
  </div>
</template>

<script>
import { validEmail, validPhone } from '@/utils/validate'
import { signin } from '@/api/user'
import { getSMS } from '@/api/user'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('用户名至少需要四位字符'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少需要六位字符'))
      } else {
        callback()
      }
    }
    const validateRepeatPassword = (rule, value, callback) => {
      if (value !== this.signinForm.password) {
        callback(new Error('两次输入不一致'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error('请输入正确的电子邮箱'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      signinForm: {
        username: '',
        realname: '',
        password: '',
        passwordRepeat: '',
        phone: '',
        validSms: '',
        email: '',
        codeID: ''
      },
      signinRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordRepeat: [{ required: true, trigger: 'blur', validator: validateRepeatPassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      smsBtnContent: '获取短信验证码',
      timerStart: false,
      leftTimeSec: 45,
      timer: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleSignin() {
      this.$refs.signinFormRef.validate(valid => {
        if (valid) {
          this.loading = true
          signin(this.signinForm).then(response => {
            this.loading = false
            this.$message({
              message: '注册成功',
              type: 'success'
            })
            this.$store.dispatch('user/login', this.signinForm)
              .then(() => {
                this.$router.push({ path: '/' })
              })
          }).catch(error => {
            this.loading = false
            this.$message({
              message: error.data.message,
              type: 'warning'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    tickSMSLeft() {
      if (this.leftTimeSec > 0) {
        this.leftTimeSec = this.leftTimeSec - 1
        this.smsBtnContent = this.leftTimeSec + ' 秒后可重发'
        return
      }
      clearInterval(this.timer)
      this.timerStart = false
      this.leftTimeSec = 45
      this.smsBtnContent = '获取短信验证码'
    },
    startTick() {
      if (this.timerStart) {
        return
      }
      this.timerStart = true
      this.timer = window.setInterval(this.tickSMSLeft, 1000)
    },
    getValidSms() {
      if (this.signinForm.phone === '') {
        this.$message({
          message: '请先输入电话号码',
          type: 'warning'
        })
        return
      }
      if (!this.timerStart) {
        this.smsBtnContent = '正在获取...'
        getSMS({ phone: this.signinForm.phone }).then(response => {
          this.startTick()
          this.signinForm.codeID = response.codeID
        }).catch(error => {
          this.$message({
            message: error.data.message,
            type: 'warning'
          })
          if (error.data.codeID) {
            this.signinForm.codeID = error.data.codeID
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 1000px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .signin-links{
    text-decoration:underline
  }

  .signin-links:hover{
    color: #1890ff;
  }

  .get-sms{
    display: inline-block;
    position: relative;
    color: #FFF;
    top: -47px;
    left: 275px;
    width: 112px;
  }

  .get-sms:hover{
    text-decoration: underline
  }

  .footer{
    width: 100%;
    height: 30px;
    position:fixed;
    bottom: 0;
    line-height: 10px;
    text-align: center;
  }

  .footer-words{
    font-size: 13px;
    color: #FFF
  }
}
</style>
