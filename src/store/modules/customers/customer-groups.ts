import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface ICustomerGroup {
  pk: number
  title: string
  code: string
}

@Module({ dynamic: true, store, name: 'customer-group' })
class CustomerGroup extends VuexModule implements ICustomerGroup {
  public pk = 0
  public title = ''
  public code = ''

  @Mutation
  private SET_PK(pk: number) {
    this.pk = pk
  }

  @Mutation
  private SET_TITLE(title: string) {
    this.title = title
  }

  @Mutation
  private SET_CODE(code: string) {
    this.code = code
  }
}
