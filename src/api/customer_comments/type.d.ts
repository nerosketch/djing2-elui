/* eslint-disable camelcase */
import {
  IDRFAxiosResponsePromise
} from '@/api/types'

export interface ICustomerComment {
  id: number
  customer_id: number
  // customer_name: string
  author_id: number
  author_name: string
  author_avatar: string
  text: string
  date_create: string
  can_remove: boolean
}
export type ICustomerCommentList = ICustomerComment[]
export type ICustomerCommentListAxiosResponsePromise = IDRFAxiosResponsePromise<ICustomerCommentList>
