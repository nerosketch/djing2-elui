<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getGroups"
      :loading="groupsLoading"
      :heightDiff='189'
    )
      span(slot="pk" slot-scope="{row}") {{ row.pk }}
      el-link(slot="title" slot-scope="{row}" type="primary")
        router-link(:to="{name: 'customersList', params:{ groupId: row.pk }}") {{ row.title }}
      span(slot="usercount" slot-scope="{row}") {{ row.usercount }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import { getCustomerGroups } from '@/api/customers/req'
import { ICustomerGroup } from '@/api/customers/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'

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
      width: 60
    },
    {
      prop: 'title',
      label: 'Название'
    },
    {
      prop: 'usercount',
      label: 'Абонентов',
      width: 140
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
}
</script>
