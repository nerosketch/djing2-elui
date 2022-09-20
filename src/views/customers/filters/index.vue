<template lang="pug">
.app-container
  el-row
    el-col

      el-row(:gutter="10")
        el-col(:span="8")
          aggregates(
            v-model="aggregations"
          )
        el-col(:span="8")
          filters(
            v-model="fieldFilters"
            ref='filts'
          )
          el-button(@click="addFilter") +

    el-col
      el-button(@click="display=true") Show
      el-button filter customers
      el-button Save filter

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
import { IAggregateFilter, ICustomer, IFilterData } from '@/api/customers/types'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { Component, Vue } from 'vue-property-decorator'
import Filters from './filters.vue'
import Aggregates from './aggregates.vue'
import CustomerFiltersStoreModule from '@/store/modules/customers/filters'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomerFilters',
  components: {
    datatable: DataTableComp,
    Filters,
    Aggregates,
  }
})
export default class extends Vue {
  public readonly $refs!: {
    filts: Filters
  }

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

  private aggregations: IAggregateFilter[] = [
    {
      aggr: 0,
      filter: {
        field: 0,
        compareOperator: 0,
        conditionValue: null
      }
    },
    {
      aggr: 0,
      filter: {
        field: 0,
        compareOperator: 0,
        conditionValue: null
      }
    }
  ]

  private fieldFilters: IFilterData[] = [
    {
      field: 0,
      compareOperator: 0,
      conditionValue: null
    }
  ]

  created() {
    CustomerFiltersStoreModule.LoadCustomerFields()
    CustomerFiltersStoreModule.LoadCustomerFkFields()
  }

  private filterCustomers(params?: IDRFRequestListParameters) {
    return getCustomers(params)
  }

  private addFilter() {
    this.$refs.filts.addFilter({
      field: 0,
      compareOperator: 0,
      conditionValue: null
    })
  }
}
</script>
