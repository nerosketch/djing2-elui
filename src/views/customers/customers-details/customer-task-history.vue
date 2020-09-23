<template lang="pug">
  datatable(
    :columns="tableColumns"
    :getData="loadTLog"
    :loading="loading"
    :heightDiff='149'
    widthStorageNamePrefix='customerTaskHistory'
    ref='tlogtbl'
  )
    template(v-slot:viewbtn="{row}")
      router-link(:to="{name: 'taskDetails', params: { taskId: row.id }}")
        el-button(
          :type="row.comment_count > 0 ? 'success' : 'primary'"
          size='mini'
        )
          template(v-if="row.comment_count > 0") {{ row.comment_count }}
          i.el-icon-view(v-else)

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
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
      prop: 'viewbtn',
      label: '#',
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    },
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
<<<<<<< HEAD
    try {
      if (params) {
        const newParams = Object.assign({
          customer: CustomerModule.pk,
          fields: 'id,author,author_uname,descr,state_str,mode_str,time_of_create'
        }, params)
        r = await getTasks(newParams)
      } else {
        r = await getTasks()
      }
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
=======
    if (params) {
      const newParams = Object.assign({
        customer: CustomerModule.pk,
        fields: 'id,author,author_uname,descr,state_str,mode_str,time_of_create,comment_count'
      }, params)
      r = await getTasks(newParams)
    } else {
      r = await getTasks()
>>>>>>> master
    }
    return r
  }
}
</script>
