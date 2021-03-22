/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerAttachement } from '@/api/customers/types'
import { getAttachment, delAttachment, addAttachment } from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'customerattachment' })
class CustomerAttachement extends VuexModule implements ICustomerAttachement {
  id = 0
  title = ''
  doc_file = ''
  create_time = ''
  author = 0
  author_name = ''
  customer = 0
  customer_name = ''

  @Mutation
  public SET_ALL_CUSTOMER_ATTACHMENT(data: ICustomerAttachement) {
    this.id = data.id
    this.title = data.title
    this.doc_file = data.doc_file
    this.create_time = data.create_time!
    this.author = data.author!
    this.author_name = data.author_name!
    this.customer = data.customer
    this.customer_name = data.customer_name
  }

  @Mutation
  public RESET_ALL_CUSTOMER_ATTACHMENT() {
    this.id = 0
    this.title = ''
    this.doc_file = ''
    this.create_time = ''
    this.author = 0
    this.author_name = ''
    this.customer = 0
    this.customer_name = ''
  }

  @Action
  public async AddCustomerAttachment(newAtt: object) {
    const { data } = await addAttachment(newAtt)
    this.SET_ALL_CUSTOMER_ATTACHMENT(data)
    return data
  }

  @Action
  public async GetCustomerAttachment(id: number) {
    const r = await getAttachment(id)
    this.SET_ALL_CUSTOMER_ATTACHMENT(r.data)
    return r
  }

  @Action
  public async DelCustomerAttachment(id: number) {
    await delAttachment(id)
    this.RESET_ALL_CUSTOMER_ATTACHMENT()
  }
}
export const CustomerAttachementModule = getModule(CustomerAttachement)
