import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerFiltersStore, CustomerField } from '@/api/customers/types'
import { getCustomerFields, getCustomerFkFields } from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'customerfilters' })
class CustomerFiltersStore extends VuexModule implements ICustomerFiltersStore {
  public customerFields: CustomerField[] = []
  public customerFkFields: CustomerField[] = []

  @Mutation
  public SET_CUSTOMER_FIELDS(cf: CustomerField[]) {
    this.customerFields = cf
  }

  @Mutation
  public SET_CUSTOMER_FK_FIELDS(cf: CustomerField[]) {
    this.customerFkFields = cf
  }

  @Action
  public async LoadCustomerFields() {
    const { data } = await getCustomerFields()
    this.SET_CUSTOMER_FIELDS(data)
  }

  @Action
  public async LoadCustomerFkFields() {
    const { data } = await getCustomerFkFields()
    this.SET_CUSTOMER_FK_FIELDS(data)
  }
}

export default getModule(CustomerFiltersStore)
