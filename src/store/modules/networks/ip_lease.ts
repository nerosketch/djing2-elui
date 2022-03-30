/* eslint-disable camelcase */
import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  getCustomerIpLease, delCustomerIpLease,
  addCustomerIpLease, changeCustomerIpLease, pingIcmpIpLease
} from '@/api/networks/req'
import { ICustomerIpLease } from '@/api/networks/types'

@Module({ dynamic: true, store, name: 'iplease' })
class CustomerIpLease extends VuexModule implements ICustomerIpLease {
  id = 0
  ip_address = ''
  pool: number | null = null
  customer = 0
  lease_time = ''
  last_update = ''
  mac_address = ''
  is_dynamic = false

  @Mutation
  public RESET_ALL_LEASE() {
    this.id = 0
    this.ip_address = ''
    this.pool = null
    this.customer = 0
    this.lease_time = ''
    this.last_update = ''
    this.mac_address = ''
    this.is_dynamic = false
    return this
  }

  @Mutation
  public SET_ALL_LEASE(data: ICustomerIpLease) {
    this.id = data.id
    this.ip_address = data.ip_address
    this.pool = data.pool
    this.customer = data.customer
    this.lease_time = data.lease_time
    this.last_update = data.last_update
    this.mac_address = data.mac_address
    this.is_dynamic = data.is_dynamic
    return this
  }

  @Action
  public async GetLease(leaseId: number) {
    const r = await getCustomerIpLease(leaseId)
    this.SET_ALL_LEASE(r.data)
    return r
  }

  @Action
  public async AddLease(newLease: object) {
    const { data } = await addCustomerIpLease(newLease)
    this.SET_ALL_LEASE(data)
    return data
  }

  @Action
  public async SaveLease() {
    const r = await changeCustomerIpLease(this.id, <ICustomerIpLease>{
      ip_address: this.ip_address,
      lease_time: this.lease_time,
      last_update: this.last_update,
      mac_address: this.mac_address,
      pool: this.pool,
      customer: this.customer,
      is_dynamic: this.is_dynamic
    })
    this.SET_ALL_LEASE(r.data)
    return r
  }

  @Action
  public async GetAllLeaseState() {
    return {
      id: this.id,
      ip_address: this.ip_address,
      pool: this.pool,
      customer: this.customer,
      lease_time: this.lease_time,
      last_update: this.last_update,
      mac_address: this.mac_address,
      is_dynamic: this.is_dynamic
    }
  }

  @Action
  public async PatchLease(info: object) {
    const { data } = await changeCustomerIpLease(this.id, info)
    this.SET_ALL_LEASE(data)
    return data
  }

  @Action
  public async DelLease(leaseId: number) {
    await delCustomerIpLease(leaseId)
    this.RESET_ALL_LEASE()
  }

  @Action
  public async PingIcmp(leaseId?: number) {
    let lid = this.id
    if (typeof leaseId === 'number' && leaseId > 0) {
      lid = leaseId
    }
    const { data } = await pingIcmpIpLease(lid)
    return data
  }
}

export const CustomerIpLeaseModule = getModule(CustomerIpLease)
