import { VuexModule, Module, Mutation, getModule, Action } from 'vuex-module-decorators'
import store from '@/store'
import { ICustomerFiltersStore, CustomerField } from '@/api/customers/types'
import { getCustomerFields } from '@/api/customers/req'

@Module({ dynamic: true, store, name: 'customerfilters' })
class CustomerFiltersStore extends VuexModule implements ICustomerFiltersStore {
  public customerFields: CustomerField[] = []
  public annotationFields: CustomerField[] = []

  @Mutation
  public SET_CUSTOMER_FIELDS(cf: CustomerField[]) {
    this.customerFields = cf
  }

  // @Mutation
  // public ADD_CUSTOMER_FIELD(cf: CustomerField) {
  //   this.customerFields.push(cf)
  // }

  // @Mutation
  // public DEL_CUSTOMER_FIELD(index: number) {
  //   this.customerFields.splice(index, 1)
  // }

  @Mutation
  public SET_ANNOTATION_FIELDS(cf: CustomerField[]) {
    this.annotationFields = cf
  }

  @Action
  public async LoadCustomerFields() {
    const { data } = await getCustomerFields()
    this.SET_CUSTOMER_FIELDS(data)
  }

  public get allCustomerFields() {
    return this.customerFields.concat(this.annotationFields)
  }
}

export default getModule(CustomerFiltersStore)
