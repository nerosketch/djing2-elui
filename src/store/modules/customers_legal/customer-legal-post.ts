/* eslint-disable camelcase */
import { Module, Mutation, getModule, Action, VuexModule } from 'vuex-module-decorators'
import store from '@/store'
import {
  addLegalCustomerPost,
  getLegalPosts,
  patchLegalCustomerPost
} from '@/api/customers_legal/req'
import { ICustomerLegalPost } from '@/api/customers_legal/types'

@Module({ dynamic: true, store, name: 'legalpost' })
class CustomerLegalPost extends VuexModule implements ICustomerLegalPost {
  id = 0
  legal_customer = 0
  post_index = ''
  address = 0

  @Mutation
  public SET_ALL_LEGAL_POST(post: ICustomerLegalPost) {
    this.id = post.id
    this.legal_customer = post.legal_customer
    this.post_index = post.post_index
    this.address = post.address
  }

  @Mutation
  public RESET_LEGAL_POST() {
    this.id = 0
    this.legal_customer = 0
    this.post_index = ''
    this.address = 0
  }

  @Mutation
  public SET_LEGAL_POST_CUSTOMER(uid: number) {
    this.legal_customer = uid
  }

  @Action
  public async getLegalPost(customerId: number) {
    this.SET_LEGAL_POST_CUSTOMER(customerId)
    const { data } = await getLegalPosts(customerId)
    if (data.length > 0) {
      this.SET_ALL_LEGAL_POST(data[0])
      return data[0]
    }
  }

  @Action
  public async updateLegalPost(info: object) {
    const { data } = await patchLegalCustomerPost(this.id, info)
    this.SET_ALL_LEGAL_POST(data)
    return data
  }

  @Action
  public async addLegalPost(info: object) {
    const { data } = await addLegalCustomerPost(this.legal_customer, info)
    this.SET_ALL_LEGAL_POST(data)
    return data
  }
}

export const CustomerLegalPostModule = getModule(CustomerLegalPost)
