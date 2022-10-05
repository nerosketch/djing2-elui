import request from '@/utils/request'
import {
  addObjectDecorator,
  delObjectDecorator,
  getObjectDecorator,
  patchObjectDecorator,
  getObjectListDecorator
} from '@/api/baseRequests'
import { IDRFAxiosResponsePromise } from '@/api/types'
import {
  ICustomerContract,
  ICustomerContractAttachment
} from './types'

const baseUrl = '/customer_contract/contract/'
export const getContracts = getObjectListDecorator<ICustomerContract>(baseUrl)
export const getContract = getObjectDecorator<ICustomerContract>(baseUrl)
export const addContract = addObjectDecorator<ICustomerContract>(baseUrl)
export const delContract = delObjectDecorator<ICustomerContract>(baseUrl)
export const changeContract = patchObjectDecorator<ICustomerContract>(baseUrl)
export const getContractInitials = (): IDRFAxiosResponsePromise<ICustomerContract> =>
  request.get<ICustomerContract>(`${baseUrl}get_initial/`)

const baseAttachmentUrl = '/customer_contract/docs/'
export const getContractDocs = getObjectListDecorator<ICustomerContractAttachment>(baseAttachmentUrl)
export const getContractDoc = getObjectDecorator<ICustomerContractAttachment>(baseAttachmentUrl)
export const addContractDoc = (newAtt: any): IDRFAxiosResponsePromise<ICustomerContractAttachment> => {
  const formData = new FormData()
  formData.append('doc_file', newAtt.doc_file)
  formData.append('title', newAtt.title)
  formData.append('contract', newAtt.contract)
  return request.post<ICustomerContractAttachment>(baseAttachmentUrl, formData)
}
export const delContractDoc = delObjectDecorator<ICustomerContractAttachment>(baseAttachmentUrl)
export const changeContractDoc = patchObjectDecorator<ICustomerContractAttachment>(baseAttachmentUrl)

export const finishCustomerContract = (uid: number): IDRFAxiosResponsePromise<ICustomerContract> =>
  request.put<ICustomerContract>(`${baseUrl}${uid}/finish/`)
