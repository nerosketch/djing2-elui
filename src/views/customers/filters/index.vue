<template lang="pug">
.app-container
  el-row
    el-col
      filter-panel
    el-col(:lg="24" :md="20")
      datatable(
        :columns="tableColumns"
        :getData="filterCustomers"
        :heightDiff="65"
        widthStorageNamePrefix="customersfilter"
        :selectable="$perms.is_superuser"
      )
</template>

<script lang="ts">
import { getCustomers } from '@/api/customers/req'
import { ICustomer } from '@/api/customers/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import FilterPanel from './filter-panel.vue'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomerFilters',
  components: {
    FilterPanel,
    datatable: DataTableComp
  }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 67
    },
    {
      prop: 'username',
      label: this.$tc('customers.username'),
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'ping',
      label: this.$tc('ping'),
      'min-width': 150
    }
  ]

  private async filterCustomers(params?: IDRFRequestListParameters) {
    let r = await getCustomers(params)
    return r
  }
}
</script>
