import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { IMessengerOptions, IOpt } from '@/api/messenger/types'
import { getOptions, setOptions } from '@/api/messenger/req'

@Module({ dynamic: true, store, name: 'messengeroptions' })
class MessengerOptions extends VuexModule implements IMessengerOptions {
  public notification_flags: IOpt[] = []
  public various_options: IOpt[] = []

  @Mutation
  public SET_ALL_MOPTS(data: IMessengerOptions) {
    this.notification_flags = data.notification_flags || []
    this.various_options = data.various_options || []
    return this
  }

  @Mutation
  public RESET_ALL_MOPTS() {
    this.notification_flags = []
    this.various_options = []
    return this
  }

  @Action
  public async GetOptions() {
    const { data } = await getOptions()
    this.SET_ALL_MOPTS(data)
    return data
  }

  @Action
  public async SetOptions(newData: IMessengerOptions) {
    const { data } = await setOptions(newData)
    this.SET_ALL_MOPTS(data)
  }
}

export const MessengerOptionsModule = getModule(MessengerOptions)

