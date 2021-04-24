/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getGateway, delGateway, addGateway, changeGateway } from '@/api/gateways/req'
import { IGateway } from '@/api/gateways/types'
import store from '@/store'

@Module({ dynamic: true, store, name: 'gateway' })
class Gateway extends VuexModule implements IGateway {
  public id = 0
  public title = ''
  public ip_address = ''
  public ip_port = 0
  public auth_login = ''
  public auth_passw = ''
  public gw_type = 0
  public is_default = false
  public enabled = false
  public customers_count = 0
  public sites?: number[] = []

  @Mutation
  public SET_ALL_GATEWAY(data: IGateway) {
    this.id = data.id
    this.title = data.title
    this.ip_address = data.ip_address
    this.ip_port = data.ip_port
    this.auth_login = data.auth_login
    this.auth_passw = data.auth_passw
    this.gw_type = data.gw_type
    this.is_default = data.is_default
    this.enabled = data.enabled
    this.customers_count = data.customers_count!
    this.sites = data.sites || []
    return this
  }

  @Mutation
  public RESET_ALL_GATEWAY() {
    this.id = 0
    this.title = ''
    this.ip_address = ''
    this.ip_port = 0
    this.auth_login = ''
    this.auth_passw = ''
    this.gw_type = 0
    this.is_default = false
    this.enabled = false
    this.customers_count = 0
    this.sites = []
    return this
  }

  @Action
  public async GetGateway(gwId: number) {
    const r = await getGateway(gwId)
    this.SET_ALL_GATEWAY(r.data)
    return r
  }

  @Action
  public async AddGateway(gw: object) {
    const { data } = await addGateway(gw)
    this.SET_ALL_GATEWAY(data)
  }

  @Action
  public async PatchGateway(newData: object) {
    const { data } = await changeGateway(this.id, newData)
    this.SET_ALL_GATEWAY(data)
  }

  @Action
  public async DelGateway(gwId: number) {
    await delGateway(gwId)
    this.RESET_ALL_GATEWAY()
  }

  /*
  @Action
  public async FetchCustomerServerNetCredentialsByGw() {
    if (this.id > 0) {
      const { data } = await fetchCustomersSrvnetCredentialsbgw(this.id)
      return data
    }
  }
  */
}

export const GatewayModule = getModule(Gateway)
