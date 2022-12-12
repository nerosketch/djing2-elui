import { Component, Vue } from 'vue-property-decorator'
import { IGateway } from '@/api/gateways/types'
import { getGateways } from '@/api/gateways/req'

@Component({
  name: 'GwsMethods'
})
export default class extends Vue {
  protected gwlist: IGateway[] = []
  protected loadingGws = false

  protected async loadGateways(fields?: string) {
    this.loadingGws = true
    try {
      const { data } = await getGateways({
        fields
      } as any)
      this.gwlist = data.results
    } finally {
      this.loadingGws = false
    }
  }
}
