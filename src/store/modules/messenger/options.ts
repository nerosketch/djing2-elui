import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IMessengerOptions } from '@/api/messenger/types'
import { getOptions, setOptions } from '@/api/messenger/req'

@Module({ dynamic: true, store, name: 'messengeroptions' })
class MessengerOptions extends VuexModule implements IMessengerOptions {
  public profile = 0
  public notification_flags: string[] = []

  @Mutation
  public SET_ALL_MOPTS(data: IMessengerOptions) {
    this.profile = data.profile
    this.notification_flags = data.notification_flags || []
    return this
  }

  @Mutation
  public RESET_ALL_MOPTS() {
    this.profile = 0
    this.notification_flags = []
    return this
  }

  @Action
  public async GetOptions() {
    const { data } = await getOptions()
    this.SET_ALL_MOPTS(data)
    return data
  }

  @Action
  public async SetOptions(newData: string[]) {
    const { data } = await setOptions(newData)
    this.SET_ALL_MOPTS(data)
  }
}

export const MessengerOptionsModule = getModule(MessengerOptions)
