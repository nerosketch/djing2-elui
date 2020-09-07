<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getGroups"
      :loading="groupsLoading"
      :heightDiff='75'
      widthStorageNamePrefix='customerGroups'
    )
      template(v-slot:pk="{row}") {{ row.pk }}

      template(v-slot:title="{row}")
        el-link(type="primary")
          router-link(:to="{name: 'customersList', params:{ groupId: row.pk }}") {{ row.title }}

      template(v-slot:usercount="{row}") {{ row.usercount }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getCustomerGroups } from '@/api/customers/req'
import { ICustomerGroup } from '@/api/customers/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'

class DataTableComp extends DataTable<ICustomerGroup> {}

@Component({
  name: 'CustomerGroupList',
  components: { 'datatable': DataTableComp }
})
export default class extends Vue {
  private groupsLoading = true

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'pk',
      label: 'ID',
      'min-width': 60
    },
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

  private async getGroups(params?: IDRFRequestListParameters) {
    this.groupsLoading = true
    if (params) {
      params['fields'] = 'pk,title,usercount'
    }
    const r = await getCustomerGroups(params)
    this.groupsLoading = false
    return r
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Группы абонентов'
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>
