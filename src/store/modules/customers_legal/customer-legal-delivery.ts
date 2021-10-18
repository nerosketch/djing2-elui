/* eslint-disable camelcase */
import { Module, Mutation, getModule, Action, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getLegalDeliveryAddrs,
  patchLegalDeliveryAddr,
  addLegalDeliveryAddr
} from '@/api/customers_legal/req'
import { ICustomerLegalDeliveryAddress } from '@/api/customers_legal/types'

@Module({ dynamic: true, store, name: 'legaldelivery' })
class CustomerLegalDeliveryAddress extends VuexModule implements ICustomerLegalDeliveryAddress {
  id = 0
  legal_customer = 0
  address = 0

  @Mutation
  public SET_ALL_LEGAL_DELIVERY(deliveryAddr: ICustomerLegalDeliveryAddress) {
    this.id = deliveryAddr.id
    this.legal_customer = deliveryAddr.legal_customer
    this.address = deliveryAddr.address
  }

  @Mutation
  public RESET_LEGAL_DELIVERY() {
    this.id = 0
    this.legal_customer = 0
    this.address = 0
  }

  @Mutation
  public SET_LEGAL_DELIVERY_CUSTOMER(uid: number) {
    this.legal_customer = uid
  }

  @Action
  public async getLegalDeliveryAddr(uid: number) {
    this.SET_LEGAL_DELIVERY_CUSTOMER(uid)
    const { data } = await getLegalDeliveryAddrs(uid)
    if (data.length > 0) {
      this.SET_ALL_LEGAL_DELIVERY(data[0])
      return data[0]
    }
  }

  @Action
  public async updateLegalDeliveryAddr(info: object) {
    const { data } = await patchLegalDeliveryAddr(this.id, info)
    this.SET_ALL_LEGAL_DELIVERY(data)
    return data
  }

  @Action
  public async addLegalDeliveryAddr(info: object) {
    const { data } = await addLegalDeliveryAddr(this.legal_customer, info)
    this.SET_ALL_LEGAL_DELIVERY(data)
    return data
  }
}

export const CustomerLegalDeliveryAddressModule = getModule(CustomerLegalDeliveryAddress)
