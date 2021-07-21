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
  public global_link = ''
  public current_webhook = ''

  @Mutation
  public SET_ALL_MESSENGER(m: IMessenger) {
    this.id = m.id
    this.title = m.title
    this.description = m.description
    this.bot_type = m.bot_type
    this.bot_type_name = m.bot_type_name
    this.token = m.token
    this.avatar = m.avatar
    this.global_link = m.global_link
    this.current_webhook = m.current_webhook
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
    this.global_link = ''
    this.current_webhook = ''
  }

  @Action
  public async GetMessenger(info: { mId: number, typeName: string} ) {
    const { data } = await getMessenger(info.typeName, info.mId)
    this.SET_ALL_MESSENGER(data)
    return data
  }

  @Action
  public async AddMessenger(m: object) {
    const { data } = await addMessenger(m, this.bot_type_name)
    this.SET_ALL_MESSENGER(data)
  }

  @Action
  public async PatchMessenger(newData: any) {
    newData.token = newData.token || undefined
    const { data } = await patchMessenger(this.bot_type_name, this.id, newData)
    this.SET_ALL_MESSENGER(data)
  }

  @Action
  public async DelMessenger(mId: number) {
    await deleteMessenger(this.bot_type_name, mId)
    this.RESET_ALL_MESSENGER()
  }
}

export const MessengerModule = getModule(Messenger)
