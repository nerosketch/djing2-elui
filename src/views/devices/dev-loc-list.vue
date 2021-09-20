<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevLocalities"
      :heightDiff='96'
      widthStorageNamePrefix='devLocalities'
    )
      template(v-slot:title="{row}")
        router-link(:to="{name: 'devicesList', params:{ localityId: row.id }}") {{ row.title }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getDevLocalities } from '@/api/devices/req'
import { IDevLocality } from '@/api/devices/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<IDevLocality> {}

@Component({
  name: 'DevLocList',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
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

  private loadDevLocalities(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,device_count'
    }
    return getDevLocalities(params)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Оборудование'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs
}
</script>
