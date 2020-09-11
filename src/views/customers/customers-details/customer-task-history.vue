<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadTLog"
    :loading="loading"
    :heightDiff='149'
    widthStorageNamePrefix='customerTaskHistory'
    ref='tlogtbl'
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { getTasks } from '@/api/tasks/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import { IDRFRequestListParameters } from '@/api/types'
import { ITask } from '@/api/tasks/types'

class DataTableComp extends DataTable<ITask> {}

@Component({
  name: 'CustomerTaskHistory',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  private loading = false
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'author_uname',
      label: 'Автор',
      'min-width': 100
    },
    {
      prop: 'descr',
      label: 'Комментарий',
      'min-width': 250
    },
    {
      prop: 'state_str',
      label: 'Состояние',
      'min-width': 200
    },
    {
      prop: 'mode_str',
      label: 'Тип',
      'min-width': 150
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания',
      'min-width': 200
    }
  ]

  private async loadTLog(params?: IDRFRequestListParameters) {
    let r
    this.loading = true
    if (params) {
      const newParams = Object.assign({
        customer: CustomerModule.pk,
        fields: 'id,author,author_uname,descr,state_str,mode_str,time_of_create'
      }, params)
      r = await getTasks(newParams)
    } else {
      r = await getTasks()
    }
    this.loading = false
    return r
  }
}
</script>
