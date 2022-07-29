/* eslint-disable camelcase */
import {
  VuexModule, Module, Action,
  Mutation, getModule
} from 'vuex-module-decorators'
import store from '@/store'
import { IPayBaseGateway } from '@/api/fin/types'
import {
  getPayGateway, addPayGateway,
  changePayGateway, delPayGateway
} from '@/api/fin/req'

@Module({ dynamic: true, store, name: 'basepaymentmodel' })
class PayBaseGateway extends VuexModule implements IPayBaseGateway {
  public id = 0
  public title = ''
  public slug = ''
  public pay_count = 0
  public payment_type = 0
  public sites?: number[] = []

  @Mutation
  public SET_ALL_PAYGW(data: IPayBaseGateway) {
    this.id = data.id
    this.title = data.title
    this.slug = data.slug
    this.pay_count = data.pay_count
    this.payment_type = data.payment_type
    this.sites = data.sites
    return this
  }

  @Mutation
  public RESET_ALL_PAYGW() {
    this.id = 0
    this.title = ''
    this.slug = ''
    this.pay_count = 0
    this.payment_type = 0
    this.sites = []
    return this
  }

  @Action
  public async GetPayGw(gwId: number) {
    const { data } = await getPayGateway(gwId)
    this.SET_ALL_PAYGW(data)
    return data
  }

  @Action
  public async AddPayGw(gw: object) {
    const { data } = await addPayGateway(gw)
    this.SET_ALL_PAYGW(data)
    return data
  }

  @Action
  public async PatchPayGw(newData: object) {
    const { data } = await changePayGateway(this.id, newData)
    this.SET_ALL_PAYGW(data)
    return data
  }

  @Action
  public async DelPayGroup(gwId: number) {
    await delPayGateway(gwId)
    this.RESET_ALL_PAYGW()
  }
}

export const PayBaseGatewayModule = getModule(PayBaseGateway)
