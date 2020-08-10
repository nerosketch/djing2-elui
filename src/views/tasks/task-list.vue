<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadTasks"
    :loading="loading"
    :tableRowClassName="tableRowClassName"
    :heightDiff='168'
    ref='tbl'
  )
    template(v-slot:id="{row}")
      router-link(:to="{name: 'taskDetails', params: { taskId: row.id }}")
        el-button(
          :type="row.comment_count > 0 ? 'success' : 'primary'"
          size='mini'
        )
          span(v-if="row.comment_count > 0") {{ row.comment_count }}
          i.el-icon-view(v-else)

    template(v-slot:customer_full_name="{row}")
      el-link(type="primary")
        router-link(:to="{ name: 'customerDetails', params: {uid: row.customer } }") {{ row.customer_full_name }}

    template(v-slot:customer_address="{row}") {{ row.customer_address }}

    template(v-slot:mode_str="{row}") {{ row.mode_str }}

    template(v-slot:descr="{row}") {{ row.descr }}

    template(v-slot:state_str="{row}") {{ row.state_str }}

    template(v-slot:time_of_create="{row}") {{ row.time_of_create }}

    el-button(
      icon="el-icon-plus"
      size='mini'
      @click="openNew"
    ) Добавить задачу

  el-dialog(
    title='Создание задачи'
    :visible.sync='formDialog'
  )
    task-form
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { ITask, ITaskPriority } from '@/api/tasks/types'
import { getTasks } from '@/api/tasks/req'
import TaskForm from './task-form.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'

class DataTableComp extends DataTable<ITask> {}

@Component({
  name: 'TaskList',
  components: { 'datatable': DataTableComp, TaskForm }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private formDialog = false

  @Prop({ default: '' })
  private tabUrl!: string

  @Watch('tabUrl')
  private onTabTypeChanged() {
    this.$refs.tbl.GetTableData()
  }

  private tableRowClassName(r: any) {
    if (r.row.is_expired === undefined) return ''
    if (!r.row.is_expired) {
      if (r.row.priority === ITaskPriority.AWARAGE) {
        return 'warning-row'
      } else if (r.row.priority === ITaskPriority.HIGHER) {
        return 'error-row'
      }
    }
    return ''
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      width: 80,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'customer_full_name',
      label: 'Имя',
      width: 250
    },
    {
      prop: 'customer_address',
      label: 'Адрес',
      width: 300
    },
    {
      prop: 'mode_str',
      label: 'Характер поломки',
      width: 150
    },
    {
      prop: 'descr',
      label: 'Описание',
      width: 300
    },
    {
      prop: 'state_str',
      label: 'Состояние',
      width: 100
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания',
      width: 170
    }
  ]
  private loading = false

  private async openNew() {
    await TaskModule.RESET_ALL_TASK()
    this.formDialog = true
  }

  private async loadTasks(params?: IDRFRequestListParameters) {
    this.loading = true
    if (params) {
      params['fields'] = 'id,customer,customer_full_name,customer_address,mode_str,descr,state_str,time_of_create,comment_count,priority,is_expired'
    }
    const r = await getTasks(params, this.tabUrl)
    this.loading = false
    return r
  }
}
</script>
