/* eslint-disable camelcase */
import { Module, Mutation, getModule, Action, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getLegalBanks,
  patchLegalBank,
  addLegalBank
} from '@/api/customers_legal/req'
import { ICustomerLegalBank } from '@/api/customers_legal/types'

@Module({ dynamic: true, store, name: 'legalbank' })
class CustomerLegalBank extends VuexModule implements ICustomerLegalBank {
  id = 0
  legal_customer = 0
  title = ''
  post_index = ''
  number = ''
  bank_code = ''
  correspondent_account = ''
  settlement_account = ''

  @Mutation
  public SET_LEGAL_BANK_CUSTOMER(uid: number) {
    this.legal_customer = uid
  }

  @Mutation
  public SET_ALL_LEGAL_BANK(bank: ICustomerLegalBank) {
    this.id = bank.id
    this.legal_customer = bank.legal_customer
    this.title = bank.title
    this.post_index = bank.post_index
    this.number = bank.number
    this.bank_code = bank.bank_code
    this.correspondent_account = bank.correspondent_account
    this.settlement_account = bank.settlement_account
  }

  @Mutation
  public RESET_LEGAL_BANK() {
    this.id = 0
    this.legal_customer = 0
    this.title = ''
    this.post_index = ''
    this.number = ''
    this.bank_code = ''
    this.correspondent_account = ''
    this.settlement_account = ''
  }

  @Action
  public async getLegalBank(customerId?: number) {
    if (customerId) {
      this.SET_LEGAL_BANK_CUSTOMER(customerId)
    }
    const { data } = await getLegalBanks(customerId || this.legal_customer)
    if (data.length > 0) {
      this.SET_ALL_LEGAL_BANK(data[0])
      return data[0]
    }
  }

  @Action
  public async updateLegalBank(info: object) {
    const { data } = await patchLegalBank(this.id, info)
    this.SET_ALL_LEGAL_BANK(data)
    return data
  }

  @Action
  public async addLegalBank(info: object) {
    const { data } = await addLegalBank(this.legal_customer, info)
    this.SET_ALL_LEGAL_BANK(data)
    return data
  }
}

export const CustomerLegalBankModule = getModule(CustomerLegalBank)
