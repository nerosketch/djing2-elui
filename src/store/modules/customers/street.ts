import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerStreet } from '@/api/customers/types'
import { getStreet, addStreet, changeStreet, delStreet } from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'street' })
class CustomerStreet extends VuexModule implements ICustomerStreet {
  public id = 0
  public name = ''
  public group = 0

  @Mutation
  private RESET_ALL_STREET() {
    this.id = 0
    this.name = ''
    this.group = 0
  }

  @Mutation
  private SET_ALL_STREET(street: ICustomerStreet) {
    this.id = street.id
    this.name = street.name
    this.group = street.group
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

export const CustomerStreetModule = getModule(CustomerStreet)
