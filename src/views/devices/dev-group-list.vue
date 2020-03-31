<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevGroups"
      ref='table'
    )
      span(slot="pk" slot-scope="{row}") {{ row.pk }}

      el-link(slot="title" slot-scope="{row}")
        router-link(:to="{name: 'devicesList', params:{groupId: row.pk}}") {{ row.title }}

      span(slot="device_count" slot-scope="{row}") {{ row.device_count }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getDevGroups } from '@/api/devices/req'
import { IDevGroup } from '@/api/devices/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'

class DataTableComp extends DataTable<IDevGroup> {}

@Component({
  name: 'DevGroupList',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  private groupDevs: IDevGroup[] = []
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      width: 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true
    },
    {
      prop: 'device_count',
      label: 'Устройств'
    }
  ]

  created() {
    this.loadDevGroups()
  }

  private async loadDevGroups(params?: IDRFRequestListParameters) {
    const r = await getDevGroups(params)
    this.groupDevs = r.data.results
    return r
  }
}
</script>
