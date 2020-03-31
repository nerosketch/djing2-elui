import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getCustomerIpLease, delCustomerIpLease,
  addCustomerIpLease, changeCustomerIpLease
} from '@/api/networks/req'
import { ICustomerIpLease } from '@/api/networks/types'

@Module({ dynamic: true, store, name: 'vlan' })
class CustomerIpLease extends VuexModule implements ICustomerIpLease {
  id = 0
  ip_address = ''
  pool = 0
  customer = 0
  lease_time = 0
  mac_address = ''
  is_dynamic = false

  @Mutation
  public RESET_ALL() {
    this.id = 0
    this.ip_address = ''
    this.pool = 0
    this.customer = 0
    this.lease_time = 0
    this.mac_address = ''
    this.is_dynamic = false
    return this
  }

  @Mutation
  public SET_ALL(data: ICustomerIpLease) {
    this.id = data.id
    this.ip_address = data.ip_address
    this.pool = data.pool
    this.customer = data.customer
    this.lease_time = data.lease_time
    this.mac_address = data.mac_address
    this.is_dynamic = data.is_dynamic
    return this
  }

  @Action
  public async GetLease(leaseId: number) {
    const r = await getCustomerIpLease(leaseId)
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async AddLease(data: ICustomerIpLease) {
    return await addCustomerIpLease(data)
  }

  @Action
  public async SaveLease() {
    const r = await changeCustomerIpLease(this.id, <ICustomerIpLease>{
      id: this.id,
      ip_address: this.ip_address,
      lease_time: this.lease_time,
      mac_address: this.mac_address,
      pool: this.pool,
      customer: this.customer,
      is_dynamic: this.is_dynamic
    })
    this.SET_ALL(r.data)
    return r
  }

  @Action
  public async DelLease(leaseId: number) {
    await delCustomerIpLease(leaseId)
    this.RESET_ALL()
  }
}

export const CustomerIpLeaseModule = getModule(CustomerIpLease)
