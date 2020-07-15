import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormMixin'
})
export default class extends Vue {
  protected frmInitial: Object | null = null

  protected get isFormUntouched() {
    if (!this.frmInitial) return false
    for (const [k, v] of Object.entries(this.frmInitial as Object)) {
      if (this.frmMod[k] == v) continue
      else return false
    }
    return true
  }
}
