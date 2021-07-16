import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import {
  IMessenger,
} from '@/api/messenger/types'
import {
  getMessenger,
  addMessenger,
  patchMessenger,
  deleteMessenger,
  messengerSendWebHook,
  messengerStopWebHook
} from '@/api/messenger/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'messenger' })
class Messenger extends VuexModule implements IMessenger {
  public id = 0
  public title = ''
  public description = ''
  public bot_type = 0
  public bot_type_name = ''
  public token = ''
  public avatar = ''

  @Mutation
  public SET_ALL_MESSENGER(m: IMessenger) {
    this.id = m.id
    this.title = m.title
    this.description = m.description
    this.bot_type = m.bot_type
    this.bot_type_name = m.bot_type_name
    this.token = m.token
    this.avatar = m.avatar
  }

  @Mutation
  public RESET_ALL_MESSENGER() {
    this.id = 0
    this.title = ''
    this.description = ''
    this.bot_type = 0
    this.bot_type_name = ''
    this.token = ''
    this.avatar = ''
  }

  @Action
  public async GetMessenger(mId: number) {
    const { data } = await getMessenger(mId)
    this.SET_ALL_MESSENGER(data)
    return data
  }

  @Action
  public async AddMessenger(m: object) {
    const { data } = await addMessenger(m)
    this.SET_ALL_MESSENGER(data)
  }

  @Action
  public async PatchMessenger(newData: object) {
    const { data } = await patchMessenger(this.id, newData)
    this.SET_ALL_MESSENGER(data)
  }

  @Action
  public async DelMessenger(mId: number) {
    await deleteMessenger(mId)
    this.RESET_ALL_MESSENGER()
  }

  @Action
  public SendWebhook(mId?: number) {
    return messengerSendWebHook(mId || this.id)
  }

  @Action
  public StopWebhook(mId?: number) {
    return messengerStopWebHook(mId || this.id)
  }
}

export const MessengerModule = getModule(Messenger)
