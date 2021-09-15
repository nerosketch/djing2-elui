<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getLocations"
      :heightDiff='118'
      widthStorageNamePrefix='customerLocations'
    )
      template(v-slot:title="{row}")
        router-link(:to="{name: 'customersList', params:{ localityId: row.id }}")
          el-link(type="primary") {{ row.title }}

      template(v-slot:usercount="{row}") {{ row.usercount }}

      el-button(
        icon='el-icon-d-caret'
        @click="goToAfkList"
      ) Фильтр afk
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getCustomerLocations } from '@/api/customers/req'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { ICustomerLocality } from '@/api/customers/types'

class DataTableComp extends DataTable<ICustomerLocality> {}

@Component({
  name: 'CustomerGroupList',
  components: { 'datatable': DataTableComp }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      'min-width': 250
    },
    {
      prop: 'usercount',
      label: 'Абонентов',
      'min-width': 140
    }
  ]

  private getLocations(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,usercount'
    }
    return getCustomerLocations(params)
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
    ] as any[])
  }
  // End Breadcrumbs

  private goToAfkList() {
    this.$router.push('/afk')
  }
}
</script>
