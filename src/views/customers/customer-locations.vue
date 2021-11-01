<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getLocations"
      :heightDiff='118'
      widthStorageNamePrefix='customerLocations'
    )
      template(v-slot:title="{row}")
        router-link.el-link.el-link--primary.is-underline(
          :to="{name: 'customersList', params:{ addrId: row.id }}"
        ) {{ row.title }}

      el-button-group
        el-button(
          icon='el-icon-d-caret'
          @click="goToAfkList"
        ) Фильтр afk
        el-button(
          icon="el-icon-user-solid"
          @click="go2Bums"
        ) Абоненты без адреса
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { getAddresses, IDRFRequestListAddrsParameters } from '@/api/addresses/req'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'

class DataTableComp extends DataTable<IAddressModel> {}

@Component({
  name: 'CustomerGroupList',
  components: { datatable: DataTableComp }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      'min-width': 250
    }
  ]

  private getLocations(params?: IDRFRequestListAddrsParameters) {
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
          title: 'Населённые пункты'
        }
      }
    ] as any)
  }
  // End Breadcrumbs

  private goToAfkList() {
    this.$router.push('/afk')
  }
  private go2Bums() {
    this.$router.push('/customers/bums/')
  }
}
</script>
