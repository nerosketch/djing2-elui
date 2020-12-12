<template lang="pug">
  el-form(
    ref='form'
    size="mini"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      label="Описание"
      prop='descr'
    )
      el-input(v-model="frmMod.descr" maxlength="128")
    el-form-item(
      label="Исполнители"
      prop='recipients'
    )
      el-select(v-model="frmMod.recipients" multiple)
        el-option(
          v-for="rec in potentialRecipients"
          :key="rec.pk"
          :label="rec.full_name || rec.username"
          :value="rec.pk"
        )
    el-form-item(
      label="Характер поломки"
      prop='mode'
    )
      el-select(v-model="frmMod.mode")
        el-option(
          v-for="tt in taskTypes"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v"
        )
    el-form-item(
      label="Приоритет"
      prop='priority'
    )
      el-select(v-model="frmMod.priority")
        el-option(
          v-for="tt in taskPriorities"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v"
        )
    el-form-item(
      label="Состояние"
      prop='task_state'
    )
      el-select(v-model="frmMod.task_state")
        el-option(
          v-for="tt in taskStates"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v"
        )
    el-form-item(
      label="Абонент"
      prop='customer'
    )
      customer-field(v-model="frmMod.customer" :defaultName="customerName")
    el-form-item(
      label="Актуальность"
      prop='out_date'
    )
      el-tooltip(content="дата, до которой нужно завершить задачу" placement="right")
        el-date-picker(
          v-model="frmMod.out_date"
          type="date"
          value-format="yyyy-MM-dd"
          format="d MMM yyyy"
        )
    el-form-item
      el-button-group
        el-button(
          type="primary"
          @click="onSubmit"
          icon='el-icon-upload'
          size='small'
          :disabled="isFormUntouched"
        ) Сохранить
        el-button(
          v-if="!isNewTask" type="danger" icon="el-icon-delete" size='small'
          @click="onDel"
          :disabled="!$perms.tasks.delete_task"
        ) Удалить
        el-button(v-if="!isNewTask" type="success" @click="onFinish" icon="el-icon-check" size='small') Завершить
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { ITaskPriority, ITaskState, ITaskType } from '@/api/tasks/types'
import CustomerField from '@/components/CustomerField/index.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { IUserProfile } from '@/api/profiles/types'
import FormMixin from '@/utils/forms'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import TaskMixin from './task-mixin'

@Component({
  name: 'TaskForm',
  components: { CustomerField }
})
export default class extends mixins(FormMixin, TaskMixin) {
  @Prop({ default: () => [] })
  private recipients!: IUserProfile[]

  private loading = false

  private taskTypes = [
    { nm: 'Не выбрано', v: ITaskType.NOT_CHOSEN },
    { nm: 'ip конфликт', v: ITaskType.IP_CONFLICT },
    { nm: 'жёлтый треугольник', v: ITaskType.YELLOW_TRIANGLE },
    { nm: 'красный крестик', v: ITaskType.RED_CROSS },
    { nm: 'слабая скорость', v: ITaskType.WEAK_SPEED },
    { nm: 'обрыв кабеля', v: ITaskType.CABLE_BREAK },
    { nm: 'подключение', v: ITaskType.CONNECTION },
    { nm: 'периодическое пропадание', v: ITaskType.PERIODIC_DISAPPEARANCE },
    { nm: 'настройка роутера', v: ITaskType.ROUTER_SETUP },
    { nm: 'настройка onu', v: ITaskType.CONFIGURE_ONU },
    { nm: 'обжать кабель', v: ITaskType.CRIMP_CABLE },
    // { nm: 'нет интернета', v: ITaskType.INTERNET_CRASH },
    { nm: 'другое', v: ITaskType.OTHER }
  ]
  private taskPriorities = [
    { nm: 'Низкий', v: ITaskPriority.LOW },
    { nm: 'Средний', v: ITaskPriority.AWARAGE },
    { nm: 'Высший', v: ITaskPriority.HIGHER }
  ]
  private taskStates = [
    { nm: 'Новая', v: ITaskState.NEW },
    { nm: 'Провалена', v: ITaskState.CONFUSED },
    { nm: 'Выполнена', v: ITaskState.COMPLETED }
  ]

  private frmMod = this.fromTaskModule

  private get fromTaskModule() {
    return {
      recipients: TaskModule.recipients,
      descr: TaskModule.descr,
      priority: TaskModule.priority,
      task_state: TaskModule.task_state,
      mode: TaskModule.mode,
      customer: TaskModule.customer,
      out_date: TaskModule.out_date || this.initialDate
    }
  }

  private frmRules = {
    recipients: [
      { required: true, message: 'Надо выбрать хотябы одного исполнителя', trigger: 'blur' }
    ],
    customer: [
      { validator: positiveNumberValueAvailable, trigger: 'blur', message: 'Нужно выбрать абонента' }
    ]
  }

  get customerName() {
    return TaskModule.customer_full_name
  }

  get initialDate() {
    let nowDate = new Date()
    let newDate = new Date(nowDate.setDate(nowDate.getDate() + 3))
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
  }

  created() {
    if (this.recipients.length < 1) {
      this.loadPotentialRecipients()
    } else {
      this.potentialRecipients = this.recipients
    }
    this.frmInitial = Object.assign({}, this.frmMod)

    // Breadcrumbs
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/tasks',
        meta: {
          hidden: true,
          title: 'Задачи'
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: 'Редактировать'
        }
      }
    ] as RouteRecord[])
    // End Breadcrumbs
  }

  get isNewTask() {
    return TaskModule.id === 0
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        if (this.isNewTask) {
          const newTask = await TaskModule.AddTask(this.frmMod)
          this.$message.success('Задача добавлена')
          this.$router.push({
            name: 'taskDetails',
            params: { taskId: newTask.id.toString() }
          })
        } else {
          await TaskModule.PatchTask(this.frmMod)
          this.frmInitial = this.fromTaskModule
          this.$message.success('Задача сохранена')
        }
        this.loading = false
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
  private onDel() {
    if (this.isNewTask) return
    this.$confirm('Задача сейчас будет удалена, внимательно').then(async() => {
      await TaskModule.DelTask()
      this.$message.success('Задача удалена')
      this.$router.push({
        name: 'taskList'
      })
    })
  }
  private async onFinish() {
    if (this.isNewTask) return
    await TaskModule.FinishTask()
    this.$message.success('Задача завершена')
    this.$router.push({
      name: 'taskList'
    })
  }
}
</script>
