<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadTLog"
    :loading="loading"
    :heightDiff='269'
    ref='tlogtbl'
  )
    template(v-slot:author_uname="{row}") {{ row.author_uname }}

    template(v-slot:descr="{row}") {{ row.descr }}

    template(v-slot:state_str="{row}") {{ row.state_str }}

    template(v-slot:mode_str="{row}") {{ row.mode_str }}

    template(v-slot:time_of_create="{row}") {{ row.time_of_create }}

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
      width: 250
    },
    {
      prop: 'descr',
      label: 'Комментарий'
    },
    {
      prop: 'state_str',
      label: 'Состояние',
      width: 200
    },
    {
      prop: 'mode_str',
      label: 'Тип',
      width: 150
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания',
      width: 200
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
