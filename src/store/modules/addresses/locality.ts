import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IAddressModel } from '@/api/addresses/types'
import { addAddress, changeAddress, delAddress, getAddress } from '@/api/addresses/req'

@Module({ dynamic: true, store, name: 'address' })
class Address extends VuexModule implements IAddressModel {
  public id = 0
  public title = ''

  @Mutation
  public RESET_ALL_ADDR() {
    this.id = 0
    this.title = ''
  }

  @Mutation
  public SET_ALL_ADDR(locality: IAddressModel) {
    this.id = locality.id
    this.title = locality.title
  }

  @Mutation
  public SET_ADDR_PK(id: number) {
    this.id = id
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
    const r = await changeAddress(this.id, newData)
    this.SET_ALL_ADDR(r.data)
    return r
  }

  @Action
  public async DelAddress(id: number) {
    await delAddress(id)
    this.RESET_ALL_ADDR()
  }
}

export const AddressModule = getModule(Address)
