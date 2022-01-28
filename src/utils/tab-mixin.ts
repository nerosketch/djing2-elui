import { Component, Vue, Watch } from "vue-property-decorator"
import { Dictionary } from "vue-router/types/router"

@Component({
  name: 'TabMixin'
})
export default class extends Vue {
  protected activeTabName: string | null = null

  @Watch('activeTabName')
  private onActiveNameChange(value: string) {
    const newPath = `${this.$route.path}?tab=${value}`
    if (newPath !== this.$route.fullPath) {
      this.$router.push(newPath)
    }
  }

  @Watch('$route.query')
  private onChangedQuery({ tab }: Dictionary<string>) {
    if (tab && tab !== this.activeTabName) {
      this.activeTabName = tab
    }
  }

  public created() {
    // Init the default selected tab
    const tab = this.$route.query.tab as string
    if (tab) {
      this.activeTabName = tab
    }
  }
}
