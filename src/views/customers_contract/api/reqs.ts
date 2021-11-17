import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  patchObjectDecorator,
  getObjectListDecorator
} from '@/api/baseRequests'
import { ICustomerContract } from './types'

const baseUrl = '/customer_contract/contract/'
export const getContracts = getObjectListDecorator<ICustomerContract>(baseUrl)
export const getContract = getObjectDecorator<ICustomerContract>(baseUrl)
export const addContract = addObjectDecorator<ICustomerContract>(baseUrl)
export const delContract = delObjectDecorator<ICustomerContract>(baseUrl)
export const changeContract = patchObjectDecorator<ICustomerContract>(baseUrl)
