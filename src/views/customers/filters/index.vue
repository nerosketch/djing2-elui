<template lang="pug">
.app-container
  el-row
    el-col

      el-row(:gutter="10")
        el-col(:span="8")
          aggregations
        el-col(:span="8")
          filters

    el-col
      el-button(@click="display=true") Show

    el-drawer(
      title="Results"
      :visible.sync="display"
      direction='rtl'
      size="50%"
    )
      datatable(
        :columns="tableColumns"
        :getData="filterCustomers"
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
import Filters from './filters.vue'
import Aggregations from './aggregates.vue'
import CustomerFiltersStoreModule from '@/store/modules/customers/filters'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomerFilters',
  components: {
    datatable: DataTableComp,
    Filters,
    Aggregations,
  }
})
export default class extends Vue {
  private display = false

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
    }
  ]

  created() {
    CustomerFiltersStoreModule.LoadCustomerFields()
    CustomerFiltersStoreModule.LoadCustomerFkFields()
  }

  private filterCustomers(params?: IDRFRequestListParameters) {
    return getCustomers(params)
  }
}
</script>
