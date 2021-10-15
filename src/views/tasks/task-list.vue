<template lang="pug">
div
  datatable(
    :columns="tableColumns"
    :getData="loadTasks"
    :tableRowClassName="tableRowClassName"
    :heightDiff='188'
    :editFieldsVisible.sync="editFieldsVisible"
    widthStorageNamePrefix='tasks'
    ref='tbl'
  )
    template(v-slot:customer_full_name="{row}")
      router-link.el-link.el-link--primary.is-underline(
        :to="{ name: 'customerDetails', params: {uid: row.customer } }"
      ) {{ row.customer_full_name }}

    template(v-slot:id="{row}")
      router-link(:to="{name: 'taskDetails', params: { taskId: row.id }}")
        el-button(
          :type="row.comment_count > 0 ? 'success' : 'primary'"
        )
          span(v-if="row.comment_count > 0") {{ row.comment_count }}
          i.el-icon-view(v-else)

    el-button-group
      el-button(
        icon="el-icon-plus"
        @click="openNew"
        :disabled="!$perms.tasks.add_task"
      ) Добавить задачу
      el-button(
        icon='el-icon-s-operation'
        @click="editFieldsVisible=true"
      ) Поля

  el-dialog(
    title='Создание задачи'
    :visible.sync='formDialog'
    :close-on-click-modal="false"
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
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<ITask> {}

@Component({
  name: 'TaskList',
  components: { datatable: DataTableComp, TaskForm }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }

  private formDialog = false

  private editFieldsVisible = false

  @Prop({ default: '' })
  private tabUrl!: string

  @Watch('tabUrl')
  private onTabTypeChanged() {
    this.$refs.tbl.LoadTableData()
  }

  private tableRowClassName(r: any) {
    if (r.row.is_expired === undefined) return ''
    if (r.row.is_expired) {
      return 'expired-row'
    } else {
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
      prop: 'customer_full_name',
      label: 'Имя',
      'min-width': 250
    },
    {
      prop: 'customer_address',
      label: 'Адрес',
      'min-width': 300
    },
    {
      prop: 'mode_str',
      label: 'Характер поломки',
      'min-width': 150
    },
    {
      prop: 'descr',
      label: 'Описание',
      'min-width': 400
    },
    {
      prop: 'state_str',
      label: 'Состояние',
      'min-width': 100
    },
    {
      prop: 'time_of_create',
      label: 'Дата создания',
      'min-width': 170
    },
    {
      prop: 'id',
      label: 'Смотреть',
      'min-width': 80,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openNew() {
    await TaskModule.RESET_ALL_TASK()
    this.formDialog = true
  }

  private loadTasks(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,customer,customer_full_name,customer_address,mode_str,descr,state_str,time_of_create,comment_count,priority,is_expired'
    }
    return getTasks(params, this.tabUrl)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Задачи'
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
