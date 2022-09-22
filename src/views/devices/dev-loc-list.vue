<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadDevAddresses"
      :heightDiff="96"
      widthStorageNamePrefix="devAddresses")
      template(#title="{row}")
        router-link.el-link.el-link--primary.is-underline(:to="{name: 'devicesList', params:{ addrId: row.id }}")
          | {{ row.fias_address_type_name }} {{ row.title }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { getAddresses } from '@/api/addresses/req'

class DataTableComp extends DataTable<IAddressModel> {}

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
      label: this.$tc('title'),
      sortable: true,
      'min-width': 250
    }
  ]

  private loadDevAddresses(params?: IDRFRequestListParameters) {
    if (params) {
      params = Object.assign(params, {
        fields: 'id,title,fias_address_type_name',
        address_type: IAddressEnumTypes.LOCALITY
      })
    }
    return getAddresses(params)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$tc('equipment')
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
