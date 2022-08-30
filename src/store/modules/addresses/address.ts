import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { addAddress, changeAddress, delAddress, getAddress } from '@/api/addresses/req'

@Module({ dynamic: true, store, name: 'address' })
class Address extends VuexModule implements IAddressModel {
  public id = 0
  public title = ''
  public address_type = IAddressEnumTypes.UNKNOWN
  public address_type_name = ''
  public parent_addr_id?: number = 0
  public parent_addr_title?: string = ''
  public fias_address_level = 0
  public fias_address_level_name = ''
  public fias_address_type = 0
  public fias_address_type_name = ''
  public children_count = 0

  @Mutation
  public RESET_ALL_ADDR() {
    this.id = 0
    this.title = ''
    this.address_type = IAddressEnumTypes.UNKNOWN
    this.address_type_name = ''
    delete this.parent_addr_id
    delete this.parent_addr_title
    this.fias_address_level = 0
    this.fias_address_level_name = ''
    this.fias_address_type = 0
    this.fias_address_type_name = ''
    this.children_count = 0
  }

  @Mutation
  public SET_ALL_ADDR(addr: IAddressModel) {
    this.id = addr.id
    this.title = addr.title
    this.address_type = addr.address_type
    this.address_type_name = addr.address_type_name!
    this.parent_addr_id = addr.parent_addr_id
    this.parent_addr_title = addr.parent_addr_title
    this.fias_address_level = addr.fias_address_level
    this.fias_address_level_name = addr.fias_address_level_name!
    this.fias_address_type = addr.fias_address_type
    this.fias_address_type_name = addr.fias_address_type_name!
    this.children_count = addr.children_count
  }

  @Mutation
  public SET_ADDR_PK(id: number) {
    this.id = id
  }

  @Mutation
  public SET_ADDR_PARENT(id: number) {
    this.parent_addr_id = id
  }

  @Action
  public async GetAddress(id: number) {
    const r = await getAddress(id)
    this.SET_ALL_ADDR(r.data)
    return r
  }

  @Action
  public async AddAddress(newData: object) {
    const { data } = await addAddress(newData)
    this.SET_ALL_ADDR(data)
    return data
  }

  @Action
  public async PatchAddress(newData: object) {
    const { data } = await changeAddress(this.id, newData)
    this.SET_ALL_ADDR(data)
    return data
  }

  @Action
  public async DelAddress(id: number) {
    await delAddress(id)
    this.RESET_ALL_ADDR()
  }
}

export const AddressModule = getModule(Address)
