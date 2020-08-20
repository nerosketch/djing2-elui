import { Component, Vue } from 'vue-property-decorator'
import { IVlanIf } from '@/api/networks/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getVlans } from '@/api/networks/req'

@Component({
  name: 'VlanMixin'
})
export default class extends Vue {
  protected vlans: IVlanIf[] = []
  protected loading = false

  protected async loadVlans(params?: IDRFRequestListParameters) {
    this.loading = true
    const defaultFIelds = 'id,title,vid,is_management'
    if (params) {
      params['fields'] = defaultFIelds
    } else {
      params = {
        page: 1,
        page_size: 2 ** 12,
        fields: defaultFIelds
      }
    }
    const r = await getVlans(params)
    this.loading = false
    this.vlans = r.data.results
    return r
  }
}
