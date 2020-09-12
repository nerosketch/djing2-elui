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

  protected async loadVlans(params?: IDRFRequestListParameters) {
    this.vlanLoading = true
    const defaultFIelds = 'id,title,vid,is_management'
    if (params) {
      params.fields = defaultFIelds
      params.page_size = 0
    } else {
      params = {
        page: 1,
        page_size: 0,
        fields: defaultFIelds
      }
    }
    try {
      const r = await getVlans(params) as any
      this.vlans = r.data
      return r
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.vlanLoading = false
    }
    return null
  }
}
