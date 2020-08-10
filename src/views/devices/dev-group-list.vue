<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevGroups"
      :heightDiff='80'
      ref='table'
    )
      template(v-slot:pk="{row}") {{ row.pk }}

      template(v-slot:title="{row}")
        el-link
          router-link(:to="{name: 'devicesList', params:{ groupId: row.pk }}") {{ row.title }}

      template(v-slot:device_count="{row}") {{ row.device_count }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getDevGroups } from '@/api/devices/req'
import { IDevGroup } from '@/api/devices/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'

class DataTableComp extends DataTable<IDevGroup> {}

@Component({
  name: 'DevGroupList',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
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
      sortable: true,
      width: 250
    },
    {
      prop: 'device_count',
      label: 'Устройств'
    }
  ]

  private async loadDevGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,title,device_count'
    }
    const r = await getDevGroups(params)
    this.groupDevs = r.data.results
    return r
  }
}
</script>
