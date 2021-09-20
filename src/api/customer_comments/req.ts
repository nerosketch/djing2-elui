import request from '@/utils/request'
import {
  ICustomerComment,
  ICustomerCommentAxiosResponse,
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

export const createCustomerComment = (newObject: object): ICustomerCommentAxiosResponse =>
  request.post<ICustomerComment>('/customer_comments/', newObject)

export const deleteCustomerComment = (commentId: number) =>
  request.delete(`/customer_comments/${commentId}/`)
