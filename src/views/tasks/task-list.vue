<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadTasks"
    :loading="loading"
    :tableRowClassName="tableRowClassName"
    ref='tbl'
  )
    el-link(slot="id" slot-scope="{row}" type="primary")
      router-link(:to="{name: 'taskDetails', params:{ taskId: row.id }}") {{ row.id }}

    el-link(slot="customer_full_name" slot-scope="{row}" type="primary")
      router-link(:to="{name: 'customerDetails', params:{uid: row.customer }}") {{ row.customer_full_name }}

    span(slot="customer_address" slot-scope="{row}") {{ row.customer_address }}
    span(slot="mode_str" slot-scope="{row}") {{ row.mode_str }}
    span(slot="descr" slot-scope="{row}") {{ row.descr }}
    span(slot="state_str" slot-scope="{row}") {{ row.state_str }}
    span(slot="time_of_create" slot-scope="{row}") {{ row.time_of_create }}

  el-button(
    type="success"
    icon="el-icon-plus"
    size='small'
    @click="openNew"
  ) Добавить задачу

  el-dialog(
    title='Создание задачи'
    :visible.sync='formDialog'
  )
    task-form()
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
    this.loadTasks()
  }

  private tableRowClassName(r: any) {
    if(r.row.is_expired === undefined) return
    if(!r.row.is_expired) {
      if(r.row.priority === ITaskPriority.LOW) {
        return 'success-row'
      } else if (r.row.priority === ITaskPriority.HIGHER) {
        return 'error-row'
      }
    }
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      width: 70
    },
    {
      prop: 'customer_full_name',
      label: 'Имя'
    },
    {
      prop: 'customer_address',
      label: 'Адрес'
    },
    {
      prop: 'mode_str',
      label: 'Характер поломки'
    },
    {
      prop: 'descr',
      label: 'Описание'
    },
    {
      prop: 'state_str',
      label: 'Состояние'
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания'
    },
  ]
  private loading = false

  private async openNew() {
    await TaskModule.RESET_ALL()
    this.formDialog = true
  }

  private async loadTasks(params?: IDRFRequestListParameters) {
    this.loading = true
    const r = await getTasks(params, this.tabUrl)
    this.loading = false
    return r
  }
}
</script>
