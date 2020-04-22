import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerStreet } from '@/api/customers/types'
import { getStreet, addStreet, changeStreet, delStreet } from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'street' })
class CustomerStreet extends VuexModule implements ICustomerStreet {
  pk = 0
  name = ''
  group = 0

  @Mutation
  private RESET_ALL_STREET() {
    this.pk = 0
    this.name = ''
    this.group = 0
  }

  @Mutation
  private SET_ALL_STREET(street: ICustomerStreet) {
    this.pk = street.pk
    this.name = street.name
    this.group = street.group
  }

  @Action
  public async GetStreet(id: number) {
    const r = await getStreet(id)
    this.SET_ALL_STREET(r.data)
    return r
  }

  @Action
  public async AddStreet(data: ICustomerStreet) {
    await addStreet(data)
    this.SET_ALL_STREET(data)
  }

  @Action
  public async SaveStreet() {
    const r = await changeStreet(this.pk, <ICustomerStreet>{
      name: this.name,
      group: this.group
    })
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
