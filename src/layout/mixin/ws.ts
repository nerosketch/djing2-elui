import { Component, Vue } from 'vue-property-decorator'

export enum IWsMessageEventTypeEnum {
  UPDATETASK = 'updatetask',
  UPDATEPERMS = 'updateperms',
  UPDATE_CUSTOMER_LEASES = 'ucls',
  UPDATE_CUSTOMER = 'update_customer'
}

export interface IWsMessage {
  eventType: IWsMessageEventTypeEnum,
  text?: string,
  data?: any
}

@Component({
  name: 'Ws'
})
export default class extends Vue {
  private wsInstance?: WebSocket
  private audioInstance?: HTMLAudioElement

  protected wsConnect() {
    if (process.env.NODE_ENV === 'production') {
      this.wsInstance = new WebSocket(`wss://${location.host}/ws`)
      // this.wsInstance = new WebSocket(`ws://${location.host}/ws`)
    }
    if (this.wsInstance) {
      this.wsInstance.onopen = () => {
        console.log('WS подключенно')
      }
      this.wsInstance.onclose = (eventclose: CloseEvent) => {
        console.log('WS соеденение закрыто, причина: ' + eventclose.reason)
      }
      this.wsInstance.onmessage = (msg: MessageEvent) => {
        const newData = JSON.parse(msg.data)
        // console.log('Сообщение:', msg)
        if (msg.type === 'message') {
          this.onMsg(newData)
        }
      }
    }
  }

  beforeMount() {
    this.wsConnect()
  }

  created() {
    this.$eventHub.$on('dilim', this.playNotify)
  }

  beforeDestroy() {
    this.$eventHub.$off('dilim', this.playNotify)
    if (this.wsInstance) {
      this.wsInstance.close()
    }
  }

  protected onMsg(msg: IWsMessage) {
    this.$eventHub.$emit(msg.eventType, msg)
  }

  public playNotify() {
    if (!this.audioInstance) {
      this.audioInstance = new Audio(require('@/assets/mario.mp3'))
    }
    this.audioInstance.play()
  }
}
