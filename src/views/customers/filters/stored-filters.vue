<template lang="pug">
el-card(shadow="never")
  template(#header) stored filters

  datatable(
    :columns="tableColumns"
    :getData="loadComplexFilters"
    :heightDiff="560"
    ref="tbl"
  )
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable from '@/components/Datatable/index.vue'
import { getComplexFilters } from '@/api/customers/req'
import { IStoredFilter } from '@/api/customers/types'

class DataTableComp extends DataTable<IStoredFilter> {}

@Component({
  name: 'StoredFilters',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {

  private tableColumns = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 67
    },
    {
      prop: 'title',
      label: 'title',
      'min-width': 100
    },
  ]

  private loadComplexFilters(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title'
    }
    return getComplexFilters(params)
  }
}
</script>
