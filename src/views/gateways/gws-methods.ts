import { Component, Vue } from 'vue-property-decorator'
import { IGateway } from '@/api/gateways/types'
import { getGateways } from '@/api/gateways/req'

@Component({
  name: 'GwsMethods'
})
export default class extends Vue {
  protected gwlist: IGateway[] = []
  protected loading = false

  protected async loadGateways(fields: string | null = null) {
    this.loading = true
    const { data } = await getGateways({
      page: 1,
      page_size: 100500,
      fields
    })
    this.gwlist = data.results
    this.loading = false
  }
}
