import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'FormMixin'
})
export default class extends Vue {
  protected frmInitial: Object | null = null

  protected get isFormUntouched() {
    if (!this.frmInitial) return false
    if (this.$data.hasOwnProperty('frmMod')) {
      for (const [k, v] of Object.entries(this.frmInitial as Object)) {
        const lv = this.$data['frmMod'][k] || null
        const rv = v || null
        if (Array.isArray(lv) && Array.isArray(rv))
        {
          if(lv.filter(i => rv.indexOf(i) < 0).length == 0) continue
          return false
        } else {
          if (lv == rv) continue
          else return false
        }
      }
    }
    return true
  }
}
