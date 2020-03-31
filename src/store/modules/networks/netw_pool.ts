import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getNetworkIpPool, delNetworkIpPool,
  addNetworkIpPool, changeNetworkIpPool,
  groupAttach
} from '@/api/networks/req'
import { INetworkIpPool, INetworkIpPoolKind } from '@/api/networks/types'

@Module({ dynamic: true, store, name: 'vlan' })
class NetworkIpPool extends VuexModule implements INetworkIpPool {
  id = 0
  network = ''
  kind = INetworkIpPoolKind.NOT_DEFINED
  description = ''
  groups: number[] = []
  ip_start = ''
  ip_end = ''
  gateway = ''

  @Mutation
  private SET_GROUPS(groups: number[]) {
    this.groups = groups
  }

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.network = ''
    this.kind = INetworkIpPoolKind.NOT_DEFINED
    this.description = ''
    this.groups = []
    this.ip_start = ''
    this.ip_end = ''
    this.gateway = ''
    return this
  }

  @Mutation
  public SET_ALL(data: INetworkIpPool) {
    this.id = data.id
    this.network = data.network
    this.kind = data.kind
    this.description = data.description
    this.groups = data.groups
    this.ip_start = data.ip_start
    this.ip_end = data.ip_end
    this.gateway = data.gateway
    return this
  }

  @Action
  public async GetPool(poolId: number) {
    const r = await getNetworkIpPool(poolId)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddPool(data: INetworkIpPool) {
    return await addNetworkIpPool(data)
  }

  @Action
  public async SavePool() {
    const r = await changeNetworkIpPool(this.id, <INetworkIpPool>{
      id: this.id,
      network: this.network,
      kind: this.kind,
      description: this.description,
      groups: this.groups,
      ip_start: this.ip_start,
      ip_end: this.ip_end,
      gateway: this.gateway
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelPool(vlanId: number) {
    await delNetworkIpPool(vlanId)
    this.RESET_ALL()
  }

  @Action
  public async GroupAttach(groups: number[]) {
    await groupAttach(this.id, groups)
    this.SET_GROUPS(groups)
  }
}

export const NetworkIpPoolModule = getModule(NetworkIpPool)
