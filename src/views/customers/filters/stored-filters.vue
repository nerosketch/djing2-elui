<template lang="pug">
el-card(shadow="never")
  template(#header) stored filters

  datatable(
    :columns="tableColumns"
    :getData="loadComplexFilters"
    :heightDiff="560"
    ref="tbl"
  )
    template(#btns="{row}")
      el-button(
        icon='el-icon-view'
        circle
        @click="displayIt(row)"
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
    },
    {
      prop: 'btns',
      label: '',
      width: 50
    }
  ]

  private loadComplexFilters(params?: IDRFRequestListParameters) {
    return getComplexFilters(params)
  }

  private displayIt(storedFilter: IStoredFilter) {
    this.$emit('display', storedFilter)
  }
}
</script>
