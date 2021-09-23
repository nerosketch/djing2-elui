import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IFiasRecursiveAddress } from '@/api/sorm/types'
import {
  getAddr, delAddr, getAddrParent,
  changeAddr, addAddr
} from '@/api/sorm/req'

@Module({ dynamic: true, store, name: 'fiasaddrs' })
class FiasRecursiveAddress extends VuexModule implements IFiasRecursiveAddress {
  id = 0
  parent_addr = 0
  address_type = 0
  address_type_name = ''
  fias_address_level = 0
  fias_address_level_name = ''
  fias_address_type = 0
  fias_address_type_name = ''
  title = ''

  @Mutation
  public SET_ALL_RECURSIVE_ADDRESS(data: IFiasRecursiveAddress) {
    this.id = data.id
    this.parent_addr = data.parent_addr
    this.title = data.title
    this.address_type = data.address_type
    this.address_type_name = data.address_type_name
    this.fias_address_level_name = data.fias_address_level_name
    this.fias_address_type = data.fias_address_type
    this.fias_address_type_name = data.fias_address_type_name
  }

  @Mutation
  public RESET_ALL_RECURSIVE_ADDRESS() {
    this.id = 0
    this.parent_addr = 0
    this.address_type = 0
    this.address_type_name = ''
    this.fias_address_level = 0
    this.fias_address_level_name = ''
    this.fias_address_type_name = ''
    this.fias_address_type = 0
    this.title = ''
  }

  @Action
  public async GetAddress(id: number) {
    const { data } = await getAddr(id)
    this.SET_ALL_RECURSIVE_ADDRESS(data)
    return data
  }

  @Action
  public async DelAddress(id: number) {
    await delAddr(id)
    this.RESET_ALL_RECURSIVE_ADDRESS()
  }

  @Action
  public async PatchAddr(newData: object) {
    const { data } = await changeAddr(this.id, newData)
    this.SET_ALL_RECURSIVE_ADDRESS(data)
    return data
  }

  @Action
  public async AddAddr(newData: object) {
    const { data } = await addAddr(newData)
    this.SET_ALL_RECURSIVE_ADDRESS(data)
    return data
  }

  @Action
  public async GetParent() {
    if (this.id > 0) {
      const { data } = await getAddrParent(this.id)
      if (data) {
        this.SET_ALL_RECURSIVE_ADDRESS(data)
      }
      return data
    }
    return null
  }
}

export const FiasRecursiveAddressModule = getModule(FiasRecursiveAddress)
