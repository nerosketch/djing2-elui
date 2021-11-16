import { Component, Vue, Watch } from 'vue-property-decorator'
import DataTable from '@/components/Datatable/index.vue'

class DataTableAnyType extends DataTable<any> {}

/*
 * В компоненте, где используется mixin, нужно в datatable указать ref='tbl',
 * и для list-filters указать filterForm примерно так:
 * list-filters(
    :addrId="addrId"
    :group.sync="filterForm.group"
    :street.sync="filterForm.street"
    :fetchGroups="fetchGroups"
  )
 *
**/

@Component({
  name: 'TableWithAddrMixin'
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableAnyType
  }

  protected filterForm = {
    group: Number(this.$route.query.group) || null,
    street: Number(this.$route.query.street) || null
  }

  @Watch('filterForm.group')
  private onGroupChange(groupId: number | null) {
    const qr = Object.assign({}, this.$route.query) as Record<string, any>
    const qgroup = qr.group
    delete qr.group

    if (groupId != qgroup) {
      if (groupId && groupId > 0) {
        qr.group = groupId
      } else {
        delete qr.group
      }
    }
    this.$router.push({ path: this.$route.path, query: qr })
  }

  @Watch('filterForm.street')
  private onStreetChange(streetId: number | null) {
    const qr = Object.assign({}, this.$route.query) as Record<string, any>
    const qstreet = qr.street
    delete qr.street

    if (streetId != qstreet) {
      if (streetId && streetId > 0) {
        qr.street = streetId
      } else {
        delete qr.street
      }
    }
    this.$router.push({ path: this.$route.path, query: qr })
  }

  @Watch('$route.query', { deep: true })
  private onChQuery() {
    this.$refs.tbl.LoadTableData()
  }
}
