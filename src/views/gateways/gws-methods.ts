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
    const { data } = await getGateways({
      page: 1,
      page_size: 100500,
      fields
    })
    this.gwlist = data.results
    this.loadingGws = false
  }
}
