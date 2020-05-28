import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'BtnShareMixin'
})
export default class extends Vue {
  protected btnText = ''
  protected btnType = ''
  protected loading = false

  protected setResState(text: string, bState: string, timeout = 3000) {
    let initTxt = this.btnText
    this.btnText = text
    this.btnType = bState
    let tm = setTimeout(() => {
        this.btnText = initTxt
        this.btnType = ''
        clearTimeout(tm)
    }, timeout)
  }
}
