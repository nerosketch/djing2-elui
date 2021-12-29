import request from '@/utils/request'
import {
  addObjectDecorator,
  delObjectDecorator
} from '@/api/baseRequests'
import {
  ICustomerComment,
  ICustomerCommentList,
  ICustomerCommentListAxiosResponsePromise
} from './type'

// ICustomerComment
export const getCustomerComments = (customer: number): ICustomerCommentListAxiosResponsePromise =>
  request.get<ICustomerCommentList>('/customer_comments/', {
    params: {
      customer
    }
  })

const cutCommentsUrl = '/customer_comments/'
export const createCustomerComment = addObjectDecorator<ICustomerComment>(cutCommentsUrl)
export const deleteCustomerComment = delObjectDecorator<ICustomerComment>(cutCommentsUrl)
