/* eslint-disable camelcase */
import { Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import {
  BaseProfileVuexModule,
  RESET_ALL_BASE_PROFILE,
  SET_ALL_BASE_PROFILE
} from '@/store/modules/profiles/base-profile'
import { ICustomerLegal } from '@/api/customers_legal/types'
import {
  addCustomerLegal,
  delCustomerLegal,
  getCustomerLegal,
  getLegalInitial,
  patchCustomerLegal
} from '@/api/customers_legal/req'

@Module({ dynamic: true, store, name: 'customerlegal' })
class CustomerLegal extends BaseProfileVuexModule implements ICustomerLegal {
  title = ''
  description = ''
  group = 0
  branches: number[] = []
  balance = 0
  address = 0
  legal_type = 0
  tax_number = ''
  state_level_reg_number = ''
  post_index = ''
  actual_start_time = ''
  actual_end_time: string | null = null

  @Mutation
  public SET_ALL_CUSTOMER_LEGAL(customer: ICustomerLegal) {
    SET_ALL_BASE_PROFILE(this, customer)
    this.title = customer.title
    this.description = customer.description
    this.groups = customer.groups
    this.branches = customer.branches
    this.balance = customer.balance
    this.address = customer.address
    this.legal_type = customer.legal_type
    this.tax_number = customer.tax_number
    this.state_level_reg_number = customer.state_level_reg_number
    this.post_index = customer.post_index
    this.actual_start_time = customer.actual_start_time
    this.actual_end_time = customer.actual_end_time
  }

  @Mutation
  public RESET_CUSTOMER_LEGAL() {
    RESET_ALL_BASE_PROFILE(this)
    this.title = ''
    this.description = ''
    this.group = 0
    this.branches = []
    this.balance = 0
    this.address = 0
    this.legal_type = 0
    this.tax_number = ''
    this.state_level_reg_number = ''
    this.post_index = ''
    this.actual_start_time = ''
    this.actual_end_time = null
  }

  @Action
  public async getCustomerLegal(uid: number) {
    const { data } = await getCustomerLegal(uid)
    this.SET_ALL_CUSTOMER_LEGAL(data)
    return data
  }

  @Action
  public async updateCustomerLegal(info: object) {
    const { data } = await patchCustomerLegal(this.id, info)
    this.SET_ALL_CUSTOMER_LEGAL(data)
    return data
  }

  @Action
  public async addCustomerLegal(info: object) {
    const { data } = await addCustomerLegal(info)
    this.SET_ALL_CUSTOMER_LEGAL(data)
    return data
  }

  @Action
  public async delCustomerLegal(uid?: number) {
    let customerUid = this.id
    if (uid) {
      customerUid = uid
    }
    await delCustomerLegal(customerUid)
    this.RESET_CUSTOMER_LEGAL()
  }

  @Action
  public async GetInitial() {
    const { data } = await getLegalInitial()
    this.SET_ALL_CUSTOMER_LEGAL(data)
  }
}

export const CustomerLegalModule = getModule(CustomerLegal)
