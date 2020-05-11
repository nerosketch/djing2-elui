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
      config.headers.Authorization = `Token ${CurrentUserProfileModule.token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  async (response) => {
    // Some example codes here:
    // code == 20000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // You can change this part for your own usage.
    console.log('response', response)
    const res = response
    if (![200, 201, 202, 204].includes(res.status)) {
      /*Message({
        message: res.statusText || 'Error',
        type: 'error',
        duration: 5 * 1000
      })*/
      /* if (res.code === 500 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          'You have been logged out, try to login again.',
          'Log out',
          {
            confirmButtonText: 'Relogin',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      } */
      return Promise.reject(new Error('Error'))
    } else {
      return res
    }
  },
  (error) => {
    let er = Object.entries(error.response.data).join('\n')
    Message({
      message: er || 'Не известная ошибка',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
