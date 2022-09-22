<template lang="pug">
.app-container
  el-row
    el-col

      el-row(:gutter="10")
        el-col.col_vert_space(:span="12")
          aggregates(
            v-model="allDat.aggregations"
            ref='aggr'
          )
            el-button(
              @click="addAggr"
              icon='el-icon-plus'
              circle
            )
        el-col.col_vert_space(:span="12")
          filters(
            v-model="allDat.fieldFilters"
            ref='filts'
          )
            el-button(
              @click="addFilter"
              icon='el-icon-plus'
              circle
            )

        el-col.col_vert_space(:span="12")
          stored-filters
            el-button(
              icon='el-icon-plus'
              circle
            )

    el-col
      el-button(@click="updateList") Show
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
        ref='tbl'
      )
        template(#username="{row}")
          slot(name="username" :row="row")
            router-link(
              :to="{name: 'customerDetails', params:{ uid: row.id }}"
            ) {{ row.username }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { IAggregateFilter, IAllFilterData, ICustomer } from '@/api/customers/types'
import { getFilteredCustomers } from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import CustomerFiltersStoreModule from '@/store/modules/customers/filters'
import { fieldsFromAggrs } from './filters'
import Filters from './filters.vue'
import Aggregates from './aggregates.vue'
import StoredFilters from './stored-filters.vue'

class DataTableComp extends DataTable<ICustomer> {}

@Component({
  name: 'CustomerFilters',
  components: {
    datatable: DataTableComp,
    Filters,
    Aggregates,
    StoredFilters,
  }
})
export default class extends Vue {
  public readonly $refs!: {
    filts: Filters
    aggr: Aggregates
    tbl: DataTableComp
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
      'min-width': 100
    },
    {
      prop: 'fio',
      label: this.$tc('customers.fio'),
      'min-width': 300,
    },
  ]

  private allDat: IAllFilterData = {
    aggregations: [
      {
        aggr: 0,
        filter: {
          field: '',
          compareOperator: 0,
          conditionValue: null
        }
      },
      {
        aggr: 0,
        filter: {
          field: '',
          compareOperator: 0,
          conditionValue: null
        }
      }
    ],
    fieldFilters: [
      {
        field: '',
        compareOperator: 0,
        conditionValue: null
      }
    ]
  }

  created() {
    CustomerFiltersStoreModule.LoadCustomerFields()
  }

  private filterCustomers(params?: IDRFRequestListParameters) {
    return getFilteredCustomers(this.allDat, params)
  }

  private addFilter() {
    this.$refs.filts.addFilter({
      field: '',
      compareOperator: 0,
      conditionValue: null
    })
  }

  private addAggr() {
    this.$refs.aggr.addAggregation({
      aggr: 0,
      filter: {
        field: '',
        compareOperator: 0,
        conditionValue: null
      }
    })
  }

  private updateList() {
    if (this.$refs.tbl) {
      this.$refs.tbl.LoadTableData()
    }
    this.display=true
  }

  @Watch('allDat.aggregations', { deep: true })
  private onChAggrs(aggrs: IAggregateFilter[]) {
    const newCFs = fieldsFromAggrs(aggrs)
    CustomerFiltersStoreModule.SET_ANNOTATION_FIELDS(newCFs)
  }
}
</script>
