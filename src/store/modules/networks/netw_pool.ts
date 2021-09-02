/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getNetworkIpPool, delNetworkIpPool,
  addNetworkIpPool, changeNetworkIpPool,
  groupAttach,
  getFreeIP
} from '@/api/networks/req'
import { INetworkIpPool, INetworkIpPoolKind } from '@/api/networks/types'

@Module({ dynamic: true, store, name: 'netpool' })
class NetworkIpPool extends VuexModule implements INetworkIpPool {
  id = 0
  network = ''
  kind = INetworkIpPoolKind.NOT_DEFINED
  description = ''
  groups: number[] = []
  ip_start = ''
  ip_end = ''
  gateway = ''
  is_dynamic = false
  sites?: number[] = []
  vlan_if = 0

  @Mutation
  private SET_GROUPS(groups: number[]) {
    this.groups = groups
  }

  @Mutation
  public SET_ID(id: number) {
    this.id = id
  }

  @Mutation
  public RESET_ALL_POOL() {
    this.id = 0
    this.network = ''
    this.kind = INetworkIpPoolKind.NOT_DEFINED
    this.description = ''
    this.groups = []
    this.ip_start = ''
    this.ip_end = ''
    this.gateway = ''
    this.is_dynamic = false
    this.vlan_if = 0
    this.sites = []
    return this
  }

  @Mutation
  public SET_ALL_POOL(data: INetworkIpPool) {
    this.id = data.id
    this.network = data.network
    this.kind = data.kind
    this.description = data.description
    this.groups = data.groups
    this.ip_start = data.ip_start
    this.ip_end = data.ip_end
    this.gateway = data.gateway
    this.is_dynamic = data.is_dynamic
    this.vlan_if = data.vlan_if || 0
    this.sites = data.sites || []
    return this
  }

  @Action
  public async GetPool(poolId: number) {
    const r = await getNetworkIpPool(poolId)
    this.SET_ALL_POOL(r.data)
    return r
  }

  @Action
  public async AddPool(newInfo: object) {
    const { data } = await addNetworkIpPool(newInfo)
    this.SET_ALL_POOL(data)
    return data
  }

  @Action
  public async PatchPool(newData: object) {
    const { data } = await changeNetworkIpPool(this.id, newData)
    this.SET_ALL_POOL(data)
    return data
  }

  @Action
  public async DelPool(id: number) {
    await delNetworkIpPool(id)
    this.RESET_ALL_POOL()
  }

  @Action
  public async GroupAttach(groups: number[]) {
    await groupAttach(this.id, groups)
    this.SET_GROUPS(groups)
  }

  @Action
  public async GetFreeIP() {
    const { data } = await getFreeIP(this.id)
    return data
  }
}

export const NetworkIpPoolModule = getModule(NetworkIpPool)
