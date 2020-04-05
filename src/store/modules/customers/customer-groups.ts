import { VuexModule, Module, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerGroup, ICustomer } from '@/api/customers/types'

@Module({ dynamic: true, store, name: 'customer-group' })
class CustomerGroup extends VuexModule implements ICustomerGroup {
  public pk = 0
  public title = ''
  public code = ''
  public usercount = 0

  @Mutation
  public SET_ALL(data: ICustomerGroup) {
    this.pk = data.pk
    this.title = data.title
    this.code = data.code
    this.usercount = data.usercount
  }

  @Mutation
  public RESET_ALL() {
    this.pk = 0
    this.title = ''
    this.code = ''
    this.usercount = 0
  }
}
export const CustomerGroupModule = getModule(CustomerGroup)
