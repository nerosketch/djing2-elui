import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IStreetModel } from '@/api/addresses/types'
import { addStreet, changeStreet, delStreet, getStreet } from '@/api/addresses/req'

@Module({ dynamic: true, store, name: 'street' })
class Street extends VuexModule implements IStreetModel {
  public id = 0
  public name = ''
  public locality = 0

  @Mutation
  private RESET_ALL_STREET() {
    this.id = 0
    this.name = ''
    this.locality = 0
  }

  @Mutation
  private SET_ALL_STREET(street: IStreetModel) {
    this.id = street.id
    this.name = street.name
    this.locality = street.locality
  }

  @Mutation
  public SET_PK(id: number) {
    this.id = id
  }

  @Action
  public async GetStreet(id: number) {
    const r = await getStreet(id)
    this.SET_ALL_STREET(r.data)
    return r
  }

  @Action
  public async AddStreet(newData: object) {
    const { data } = await addStreet(newData)
    this.SET_ALL_STREET(data)
    return data
  }

  @Action
  public async PatchStreet(newData: object) {
    const r = await changeStreet(this.id, newData)
    this.SET_ALL_STREET(r.data)
    return r
  }

  @Action
  public async DelStreet(id: number) {
    await delStreet(id)
    this.RESET_ALL_STREET()
  }
}

export const StreetModule = getModule(Street)
