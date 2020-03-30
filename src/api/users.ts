import request from '@/utils/request'

export const getUserInfo = () =>
  request({
    url: '/profiles/current/',
    method: 'get'
  })

export const login = (data: any) =>
  request({
    url: '/profiles/token-auth/',
    method: 'post',
    data
  })

export const logout = () =>
  request({
    url: '/profiles/logout/',
    method: 'post'
  })
