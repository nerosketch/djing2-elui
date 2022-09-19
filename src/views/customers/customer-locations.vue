<template lang="pug">
  .app-container
    datatable(
      :columns="innerTableColumns"
      :getData="getLocationsFunc || getLocations"
      :heightDiff="heightDiff"
      widthStorageNamePrefix="customerLocations")
      template(#title="{row}")
        slot(name="title" :row="row")
          router-link.el-link.el-link--primary.is-underline(:to="{name: 'customerList', params:{ addrId: row.id }}")
            | {{ row.title }}

      slot(name="buttons")
        el-button-group
          el-button(icon="el-icon-d-caret" @click="goToAfkList")
            | {{ $t('customers.afkFilter') }}

          el-button(icon="el-icon-user-solid" @click="go2Bums")
            | {{ $t('customers.withoutAddrs') }}

          router-link(type='primary' :to="{name: 'customerFilters'}") Filters

    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { getAddresses, IDRFRequestListAddrsParameters } from '@/api/addresses/req'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'

class DataTableComp extends DataTable<IAddressModel> {}

@Component({
  name: 'CustomerLocationList',
  components: { datatable: DataTableComp }
})
export default class extends Vue {
  @Prop({ default: 118 }) private heightDiff!: number
  @Prop({ default: null }) private tableColumns!:IDataTableColumn[] | null
  @Prop({ default: null }) private getLocationsFunc!: (params?: IDRFRequestListAddrsParameters) => void

  private innerTableColumns: IDataTableColumn[] = this.tableColumns || [
    {
      prop: 'title',
      label: this.$tc('title'),
      'min-width': 250
    }
  ]

  private getLocations(params?: IDRFRequestListAddrsParameters) {
    if (params) {
      params = Object.assign(params, {
        fields: 'id,title',
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
          title: this.$tc('addrs.addresses')
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
