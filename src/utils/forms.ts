import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormMixin'
})
export default class extends Vue {
  protected frmInitial: Object | null = null

  protected get isFormUntouched() {
    if (!this.frmInitial) return false
    return JSON.stringify(this.$data.frmMod) === JSON.stringify(this.frmInitial)
  }
}
