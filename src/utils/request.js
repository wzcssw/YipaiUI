import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    return res.data
  },
  error => {
    if (error.response.status === 403) {
      return new Promise(async resolve => {
        Message({
          message: '会话过期,请重新登录',
          type: 'warning',
          duration: 3 * 1000
        })
        await store.dispatch('user/logout')
        router.push('/login')
        resolve()
      })
    }
    if (error.response.status === 500) {
      Message({
        message: '服务器错误(500)',
        type: 'error',
        duration: 5 * 1000
      })
      return
    }
    return Promise.reject(error.response)
  }
)

export default service
