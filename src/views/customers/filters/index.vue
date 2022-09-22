<template lang="pug">
.app-container
  el-row
    el-col
      p [{{ filterId }}] {{ filterTitle }}
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
          stored-filters(
            @display="displayFilter"
          )
            el-button(
              icon='el-icon-plus'
              circle
            )

    el-col
      el-button(@click="updateList") Show
      el-button filter customers
      el-button(
        @click="saveCurrentFilter"
      ) Save filter

    el-drawer(
      title="Results"
      :visible.sync="display"
      direction='rtl'
      size="50%"
    )
      datatable(
        :columns="tableColumns"
        :getData="filterCustomers"
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
import { IAggregateFilter, IAllFilterData, ICustomer, IStoredFilter } from '@/api/customers/types'
import { addComplexFilter, changeComplexFilter, getFilteredCustomers } from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import CustomerFiltersStoreModule from '@/store/modules/customers/filters'
import { fieldsFromAggrs } from './filters'
import Filters from './filters.vue'
import Aggregates from './aggregates.vue'
import StoredFilters from './stored-filters.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

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
  private filterTitle = '-'
  private filterId = 0

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
    aggregations: [],
    fieldFilters: []
  }

  created() {
    this.setCrumbs()
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

  get isNew() {
    return this.filterId === 0
  }

  private async saveCurrentFilter() {
    let retData
    const reqData = {
      title: this.filterTitle,
      filterSchema: this.allDat
    }
    if (this.isNew) {
      const { data } = await addComplexFilter(reqData)
      retData = data
    } else {
      const { data } = await changeComplexFilter(this.filterId, reqData)
      retData = data
    }
    if (retData.id) {
      this.filterId = retData.id
      this.filterTitle = retData.title
      this.allDat = retData.filterSchema
    }
  }

  private displayFilter(storedFilter: IStoredFilter) {
    console.log('storedFilter', storedFilter)
    if (storedFilter.id) {
      this.filterId = storedFilter.id
      this.filterTitle = storedFilter.title
      this.allDat = JSON.parse(JSON.stringify(storedFilter.filterSchema))
    }
  }

  // Breadcrumbs
  private async setCrumbs() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/customers/',
        meta: {
          hidden: true,
          title: this.$tc('addrs.addresses')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: 'filters'
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
