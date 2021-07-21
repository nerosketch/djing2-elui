import { getMessengerTypes } from '@/api/messenger/req'
import { Component, Vue } from 'vue-property-decorator'

export interface IObjectBotType {
  val: number
  text: string
}

@Component({
  name: 'BotTypesMixin'
})
export default class extends Vue {
  protected messengerTypesLoading = false

  public messengerBotTypes: IObjectBotType[] = []

  public async loadMessengerTypes() {
    this.messengerTypesLoading = true
    try {
      const { data } = await getMessengerTypes()
      const mt = data.map(m => ({ val: m[0], text: m[1] }))
      this.messengerBotTypes = mt
    } finally {
      this.messengerTypesLoading = false
    }
  }
}
