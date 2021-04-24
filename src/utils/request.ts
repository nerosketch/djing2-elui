import axios from 'axios'
import { Message } from 'element-ui'
import { CurrentUserProfileModule } from '@/store/modules/profiles/current-user-profile'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 20000
})

// Request interceptors
service.interceptors.request.use(
  (config) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (CurrentUserProfileModule.token) {
      config.headers['Authorization'] = `Token ${CurrentUserProfileModule.token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  async response => {
    if (![200, 201, 202, 204].includes(response.status)) {
      let er = Object.entries(response.data).join('\n')
      Message({
        message: er || 'Не известная ошибка',
        type: 'error',
        duration: 15000
      })
      return Promise.reject(new Error('Error'))
    } else {
      return response
    }
  },
  error => {
    if (error.response.status === 403) {
      console.log('Permission Denied', error.response)
      return
    }
    let er = error.response.data
    if (typeof er === 'object') {
      er = Object.entries(er).join('\n')
    }
    Message({
      message: er || 'Неизвестная ошибка',
      type: 'error',
      duration: 7000,
      showClose: true
    })
    return Promise.reject(error)
  }
)

export default service
