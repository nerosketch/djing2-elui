import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import {
  IMessenger,
  IMessengerBotType
} from '@/api/messenger/types'
import {
  getMessenger,
  addMessenger,
  patchMessenger,
  deleteMessenger
} from '@/api/messenger/req'
import store from '@/store'

@Module({ dynamic: true, store, name: 'messenger' })
class Messenger extends VuexModule implements IMessenger {
  public id = 0
  public title = ''
  public description = ''
  public bot_type = IMessengerBotType.UNDEFINED
  public bot_type_name = ''
  public slug = ''
  public token = ''
  public avatar = ''

  @Mutation
  public SET_ALL_MESSENGER(m: IMessenger) {
    this.id = m.id
    this.title = m.title
    this.bot_type = m.bot_type
    this.bot_type_name = m.bot_type_name
    this.slug = m.slug
  }

  @Mutation
  public RESET_ALL_MESSENGER() {
    this.id = 0
    this.title = ''
    this.bot_type = IMessengerBotType.UNDEFINED
    this.bot_type_name = ''
    this.slug = ''
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
}

export const MessengerModule = getModule(Messenger)
