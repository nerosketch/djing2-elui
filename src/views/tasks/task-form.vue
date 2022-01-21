<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('description')" prop="descr")
      el-input(
        v-model="frmMod.descr"
        maxlength="128"
      )

    el-form-item(:label="$t('implementers')" prop="recipients")
      el-select(
        v-model="frmMod.recipients"
        multiple
      )
        el-option(
          v-for="rec in potentialRecipients"
          :key="rec.id"
          :label="rec.full_name || rec.username"
          :value="rec.id")

    el-form-item(:label="$t('natureOfFracture')" prop="mode")
      el-select(v-model="frmMod.mode")
        el-option(
          v-for="tt in taskTypes"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")

    el-form-item(:label="$t('priority')" prop="priority")
      el-select(v-model="frmMod.priority")
        el-option(
          v-for="tt in taskPriorities"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")

    el-form-item(:label="$t('status')" prop="task_state")
      el-select(v-model="frmMod.task_state")
        el-option(
          v-for="tt in taskStates"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")

    el-form-item(
      :label="$t('customer')"
      prop="customer"
    )
      customer-field(
        v-model="frmMod.customer"
        :defaultName="$store.state.task.customer_full_name"
      )

    el-form-item(:label="$t('relevance')" prop="out_date")
      el-tooltip(
        content="дата, до которой нужно завершить задачу"
        placement="right"
      )
        el-date-picker(
          v-model="frmMod.out_date"
          type="date"
          value-format="yyyy-MM-dd"
          format="d.MM.yyyy")

    el-form-item
      el-button-group
        el-button(
          type="primary"
          @click="onSubmit"
          icon="el-icon-upload"
          :disabled="isFormUntouched")
          | {{ $t('save') }}

        el-button(
          v-if="!isNewTask"
          type="danger"
          icon="el-icon-delete"
          @click="onDel"
          :disabled="!$perms.tasks.delete_task")
          | {{ $t('del') }}

        el-button(
          v-if="!isNewTask"
          type="success"
          @click="onFinish"
          icon="el-icon-check")
          | {{ $t('complete') }}
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { ITaskPriority, ITaskState, ITaskType } from '@/api/tasks/types'
import CustomerField from '@/components/CustomerField/index.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { IUserProfile } from '@/api/profiles/types'
import FormMixin from '@/utils/forms'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
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
    { nm: this.$tc('notSelected'), v: ITaskType.NOT_CHOSEN },
    { nm: this.$tc('conflict'), v: ITaskType.IP_CONFLICT },
    { nm: this.$tc('yellowTriangle'), v: ITaskType.YELLOW_TRIANGLE },
    { nm: this.$tc('redCross'), v: ITaskType.RED_CROSS },
    { nm: this.$tc('weakSpeed'), v: ITaskType.WEAK_SPEED },
    { nm: this.$tc('cableBreaking'), v: ITaskType.CABLE_BREAK },
    { nm: this.$tc('connection'), v: ITaskType.CONNECTION },
    { nm: this.$tc('periodicMissing'), v: ITaskType.PERIODIC_DISAPPEARANCE },
    { nm: this.$tc('routeConstruction'), v: ITaskType.ROUTER_SETUP },
    { nm: this.$tc('onuConfig'), v: ITaskType.CONFIGURE_ONU },
    { nm: this.$tc('cable'), v: ITaskType.CRIMP_CABLE },
    // { nm: 'нет интернета', v: ITaskType.INTERNET_CRASH },
    { nm: this.$tc('other'), v: ITaskType.OTHER }
  ]

  private taskPriorities = [
    { nm: this.$tc('low'), v: ITaskPriority.LOW },
    { nm: this.$tc('average'), v: ITaskPriority.AWARAGE },
    { nm: this.$tc('higher'), v: ITaskPriority.HIGHER }
  ]

  private taskStates = [
    { nm: this.$tc('new'), v: ITaskState.NEW },
    { nm: this.$tc('loss'), v: ITaskState.CONFUSED },
    { nm: this.$tc('implemented'), v: ITaskState.COMPLETED }
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

  @Watch('$store.state.task', { deep: true })
  private onUpdateTask() {
    this.frmMod = this.fromTaskModule
    this.frmInitial = Object.assign({}, this.frmMod)
  }

  private frmRules = {
    recipients: [
      { required: true, message: this.$tc('weHaveToChooseOnePerpetrator'), trigger: 'blur' }
    ],
    customer: [
      { validator: positiveNumberValueAvailable, trigger: 'blur', message: this.$tc('weNeedToPickASubscription') }
    ]
  }

  get initialDate() {
    const nowDate = new Date()
    const newDate = new Date(nowDate.setDate(nowDate.getDate() + 3))
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
          title: this.$tc('route.tasks')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$tc('editorial')
        }
      }
    ] as any)
    // End Breadcrumbs
  }

  get isNewTask() {
    return TaskModule.id === 0
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        if (this.isNewTask) {
          const newTask = await TaskModule.AddTask(this.frmMod)
          this.$message.success(this.$tc('targetAdded'))
          this.$router.push({
            name: 'taskDetails',
            params: { taskId: newTask.id.toString() }
          })
        } else {
          await TaskModule.PatchTask(this.frmMod)
          this.frmInitial = this.fromTaskModule
          this.$message.success(this.$tc('targetRetained'))
        }
        this.loading = false
      } else {
        this.$message.error(this.$tc('fixFormErrs').toString())
      }
    })
  }

  private onDel() {
    if (this.isNewTask) return
    this.$confirm(this.$tc('theTaskWillBeRemovedNowCarefully')).then(async() => {
      await TaskModule.DelTask()
      this.$message.success(this.$tc('targetRemoved'))
      this.$router.push({
        name: 'taskList'
      })
    })
  }

  private async onFinish() {
    if (this.isNewTask) return
    await TaskModule.FinishTask()
    this.$message.success(this.$tc('targetCompleted'))
    this.$router.push({
      name: 'taskList'
    })
  }
}
</script>
