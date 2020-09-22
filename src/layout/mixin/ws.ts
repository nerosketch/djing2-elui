import { Component, Vue } from 'vue-property-decorator'

export enum IWsMessageEventTypeEnum {
  UPDATETASK = 'updatetask',
  UPDATEPERMS = 'updateperms'
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
    this.wsInstance = new WebSocket(`wss://${location.host}/ws`)
    // this.wsInstance = new WebSocket('ws://127.0.0.1:8081/ws')
    this.wsInstance.onopen = () => {
      console.log('WS подключенно')
    }
    this.wsInstance.onclose = (eventclose: CloseEvent) => {
      console.log('соеденение закрыто причина: ' + eventclose.reason)
    }
    this.wsInstance.onmessage = (msg: MessageEvent) => {
      let newData = JSON.parse(msg.data)
      console.log('Сообщение:', msg)
      if (msg.type === 'message') {
        this.onMsg(newData)
      }
    }
  }

  beforeMount() {
    this.wsConnect()
  }

  beforeDestroy() {
    if (this.wsInstance) {
      this.wsInstance.close()
    }
  }

  protected onMsg(msg: IWsMessage) {
    if (msg.text) {
      this.playNotify()
    }
    this.$eventHub.$emit(msg.eventType, msg)
  }

  private playNotify() {
    if (!this.audioInstance) {
      this.audioInstance = new Audio(require('@/assets/mario.mp3'))
    }
    this.audioInstance.play()
  }
}
