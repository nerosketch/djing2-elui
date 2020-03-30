import request from '@/utils/request'
import { IDRFRequestListParameters } from '@/api/types'

export const getCustomers = () =>
  request({
    url: '/customers/',
    method: 'get'
  })

export const getCustomer = (customerId: number) =>
  request({
    url: `/customers/${customerId}/`,
    method: 'get'
  })

export const getCustomerFormInitial = () =>
  request({
    url: '/customers/get_initial/',
    method: 'get'
  })

export const getCustomerGroups = (params: IDRFRequestListParameters) =>
  request({
    url: '/customers/groups/',
    method: 'get',
    params
  })
