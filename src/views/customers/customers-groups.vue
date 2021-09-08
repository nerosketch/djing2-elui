<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getGroups"
      :heightDiff='118'
      widthStorageNamePrefix='customerGroups'
    )
      template(v-slot:title="{row}")
        router-link(:to="{name: 'customersList', params:{ groupId: row.id }}")
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
import { getCustomerGroups } from '@/api/customers/req'
import { ICustomerGroup } from '@/api/customers/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<ICustomerGroup> {}

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

  private getGroups(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,usercount'
    }
    return getCustomerGroups(params)
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
    ] as any[])
  }
  // End Breadcrumbs

  private goToAfkList() {
    this.$router.push('/afk')
  }
}
</script>
