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
  parent_ao = 0
  title = ''
  ao_level = 0
  ao_level_name = ''
  ao_type = 0
  ao_type_name = ''
  groups: number[] = []

  @Mutation
  public SET_ALL_RECURSIVE_ADDRESS(data: IFiasRecursiveAddress) {
    this.id = data.id
    this.parent_ao = data.parent_ao
    this.title = data.title
    this.ao_level = data.ao_level
    this.ao_level_name = data.ao_level_name
    this.ao_type = data.ao_type
    this.ao_type_name = data.ao_type_name
    this.groups = data.groups
  }

  @Mutation
  public RESET_ALL_RECURSIVE_ADDRESS() {
    this.id = 0
    this.parent_ao = 0
    this.title = ''
    this.ao_level = 0
    this.ao_level_name = ''
    this.ao_type = 0
    this.ao_type_name = ''
    this.groups = []
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
