import { Component, Vue } from 'vue-property-decorator'
import { IVlanIf } from '@/api/networks/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getVlans } from '@/api/networks/req'

@Component({
  name: 'VlanMixin'
})
export default class extends Vue {
  protected vlans: IVlanIf[] = []
  protected vlanLoading = false

  protected async loadVlans(params?: IDRFRequestListParameters, fields?: string) {
    this.vlanLoading = true
    const defaultFIelds = fields || 'id,title,vid,is_management,sites'
    if (params) {
      params.fields = defaultFIelds
      params.page_size = 100000
    } else {
      params = {
        page: 1,
        page_size: 100000,
        fields: defaultFIelds
      }
    }
    try {
      const r = await getVlans(params)
      this.vlans = r.data.results
      return r
    } finally {
      this.vlanLoading = false
    }
  }
}
