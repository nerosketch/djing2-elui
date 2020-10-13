import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerGroup, ICustomer } from '@/api/customers/types'

@Module({ dynamic: true, store, name: 'customer-group' })
class CustomerGroup extends VuexModule implements ICustomerGroup {
  public pk = 0
  public title = ''
  public usercount = 0

  @Mutation
  public SET_ALL_GROUPS(data: ICustomerGroup) {
    this.pk = data.pk
    this.title = data.title
    this.usercount = data.usercount
  }

  @Mutation
  public RESET_ALL_GROUPS() {
    this.pk = 0
    this.title = ''
    this.usercount = 0
  }
}
export const CustomerGroupModule = getModule(CustomerGroup)
