<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('description')")
      el-input(
        v-model="frmMod.descr"
        maxlength="128"
      )

    el-form-item(:label="$t('implementers')" prop="recipients")
      recipients-field-choice(
        :recipients="recipients"
        v-model="frmMod.recipients"
      )

    el-form-item(:label="$t('tasks.natureOfFracture')")
      task-modes-field-choice(
        v-model="frmMod.task_mode_id"
      )

    el-form-item(:label="$t('priority')")
      el-select(v-model="frmMod.priority")
        el-option(
          v-for="tt in taskPriorities"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")

    el-form-item(:label="$t('tasks.taskStatus')")
      el-select(v-model="frmMod.task_state")
        el-option(
          v-for="tt in taskStates"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")

    el-form-item(
      :label="$t('customer')"
      prop="customer_id"
    )
      customer-field(
        v-model="frmMod.customer_id"
        :defaultName="$store.state.task.customer_full_name"
      )

    el-form-item(:label="$t('tasks.relevance')")
      el-tooltip(
        :content="$t('tasks.relevanceTooltip')"
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
import { ITaskPriority, ITaskState } from '@/api/tasks/types'
import CustomerField from '@/components/CustomerField/index.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { IUserProfile } from '@/api/profiles/types'
import FormMixin from '@/utils/forms'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import TaskModesFieldChoice from './modes/modes_field_choice.vue'
import RecipientsFieldChoice from './recipients-field-choice.vue'

@Component({
  name: 'TaskForm',
  components: {
    CustomerField,
    TaskModesFieldChoice,
    RecipientsFieldChoice
  }
})
export default class extends mixins(FormMixin) {
  @Prop({ default: () => [] })
  private recipients!: IUserProfile[]

  private loading = false

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
      task_mode_id: TaskModule.task_mode,
      customer_id: TaskModule.customer,
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
      { required: true, message: this.$tc('tasks.weHaveToChooseOnePerpetrator'), trigger: 'blur' }
    ],
    customer_id: [
      { validator: positiveNumberValueAvailable, trigger: 'blur', message: this.$tc('weNeedToPickASubscription') }
    ]
  }

  get initialDate() {
    const nowDate = new Date()
    const newDate = new Date(nowDate.setDate(nowDate.getDate() + 3))
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
  }

  created() {
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
          title: this.$tc('edit')
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
          this.$message.success(this.$tc('tasks.targetAdded'))
          this.$router.push({
            name: 'taskDetails',
            params: { taskId: newTask.id.toString() }
          })
        } else {
          await TaskModule.PatchTask(this.frmMod)
          this.frmInitial = this.fromTaskModule
          this.$message.success(this.$tc('tasks.targetRetained'))
        }
        this.loading = false
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
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
