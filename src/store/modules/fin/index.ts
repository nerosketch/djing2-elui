/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IPayAllTimeGateway } from '@/api/fin/types'
import { getPayGateway, addPayGateway, changePayGateway, delPayGateway } from '@/api/fin/req'

@Module({ dynamic: true, store, name: 'payalltimegateway' })
class PayAllTimeGateway extends VuexModule implements IPayAllTimeGateway {
  public id = 0
  public title = ''
  public secret = ''
  public service_id = ''
  public slug = ''
  public pay_count = 0
  public sites?: number[] = []

  @Mutation
  public SET_ALL_PAYGW(data: IPayAllTimeGateway) {
    this.id = data.id
    this.title = data.title
    this.secret = data.secret
    this.service_id = data.service_id
    this.slug = data.slug
    this.pay_count = data.pay_count
    this.sites = data.sites
    return this
  }

  @Mutation
  public RESET_ALL_PAYGW() {
    this.id = 0
    this.title = ''
    this.secret = ''
    this.service_id = ''
    this.slug = ''
    this.pay_count = 0
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

export const PayAllTimeGatewayModule = getModule(PayAllTimeGateway)
