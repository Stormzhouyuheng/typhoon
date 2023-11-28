import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'
import store from '@/store'
import errorCode from '@/utils/errorCode'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: '',
  // 超时
  timeout: 10000
})
// request拦截器
service.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200;
  // 获取错误信息
  const message = errorCode[code] || res.data.msg || errorCode['default']
  if (code === 401) {

  } else if (code === 500) {
    Message({
      message: message,
      type: 'error'
    })
    return Promise.reject(new Error(message))
  } else if (code !== 200) {
    Notification.error({
      title: message
    })
    return Promise.reject('error')
  } else {
    return res.data
  }
},
  error => {
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
