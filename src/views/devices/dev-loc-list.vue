<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevAddresses"
      :heightDiff='96'
      widthStorageNamePrefix='devAddresses'
    )
      template(v-slot:title="{row}")
        router-link(:to="{name: 'devicesList', params:{ localityId: row.id }}") {{ row.title }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getDevAddresses } from '@/api/devices/req'
import { IDevAddress } from '@/api/devices/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<IDevAddress> {}

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

  private loadDevAddresses(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,device_count'
    }
    return getDevAddresses(params)
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
