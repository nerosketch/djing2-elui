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
  input_octets = 0
  output_octets = 0
  input_packets = 0
  output_packets = 0
  h_input_octets = ''
  h_output_octets = ''
  h_input_packets = ''
  h_output_packets = ''
  cvid = 0
  svid = 0
  lease_state: boolean | null = null
  session_id: string | null = null
  radius_username: string | null = null

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
    this.input_octets = 0
    this.output_octets = 0
    this.input_packets = 0
    this.output_packets = 0
    this.cvid = 0
    this.svid = 0
    this.lease_state = null
    this.session_id = null
    this.radius_username = null
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
    this.input_octets = data.input_octets
    this.output_octets = data.output_octets
    this.input_packets = data.input_packets
    this.output_packets = data.output_packets
    this.cvid = data.cvid
    this.svid = data.svid
    this.lease_state = data.lease_state
    this.session_id = data.session_id
    this.radius_username = data.radius_username
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
