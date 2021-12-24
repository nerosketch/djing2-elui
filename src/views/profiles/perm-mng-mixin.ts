import { Component, Vue } from 'vue-property-decorator'
import { getAllPermissions } from '@/api/profiles/req'
import { IPermission } from '@/api/types'

@Component({
  name: 'PermMngMixin'
})
export default class extends Vue {
  protected allPerms: IPermission[] = []
  protected leftChecked: number[] = []
  protected saveLoading = false

  protected async loadPerms() {
    const { data } = await getAllPermissions()
    this.allPerms = data
  }

  protected prop: object = {
    key: 'id',
    label: 'name'
  }

  protected selectReadonly() {
    const roPerms = this.allPerms.filter(el => el.codename.startsWith('view_'))
    if (roPerms.length > 0) {
      this.leftChecked = roPerms.map(p => p.id)
    } else {
      this.$message.info(this.$t('ne-nashyol-prava-na-chtenie'))
    }
  }

  created() {
    this.loadPerms()
  }
}
