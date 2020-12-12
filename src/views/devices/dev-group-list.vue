<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevGroups"
      :heightDiff='96'
      widthStorageNamePrefix='devGroups'
      ref='table'
    )
      template(v-slot:title="{row}")
        router-link(:to="{name: 'devicesList', params:{ groupId: row.pk }}") {{ row.title }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getDevGroups } from '@/api/devices/req'
import { IDevGroup } from '@/api/devices/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'

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
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'device_count',
      label: 'Устройств'
    }
  ]

  private loadDevGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'pk,title,device_count'
    }
    return getDevGroups(params)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Устройства'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
