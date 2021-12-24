<template lang="pug">
  el-form(
    ref="form"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('opisanie-12')", prop="descr")
      el-input(v-model="frmMod.descr", maxlength="128")
  
    el-form-item(:label="$t('ispolniteli')", prop="recipients")
      el-select(v-model="frmMod.recipients", multiple)
        el-option(
          v-for="rec in potentialRecipients"
          :key="rec.id"
          :label="rec.full_name || rec.username"
          :value="rec.id")
  
    el-form-item(:label="$t('kharakter-polomki')", prop="mode")
      el-select(v-model="frmMod.mode")
        el-option(
          v-for="tt in taskTypes"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")
  
    el-form-item(:label="$t('prioritet')", prop="priority")
      el-select(v-model="frmMod.priority")
        el-option(
          v-for="tt in taskPriorities"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")
  
    el-form-item(:label="$t('sostoyanie-0')", prop="task_state")
      el-select(v-model="frmMod.task_state")
        el-option(
          v-for="tt in taskStates"
          :key="tt.v"
          :label="tt.nm"
          :value="tt.v")
  
    el-form-item(:label="$t('abonent')", prop="customer")
      customer-field(v-model="frmMod.customer", :defaultName="$store.state.task.customer_full_name")
  
    el-form-item(:label="$t('aktualnost')", prop="out_date")
      el-tooltip(content="дата, до которой нужно завершить задачу", placement="right")
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
          | {{ $t('udalit-1') }}
      
        el-button(
          v-if="!isNewTask"
          type="success"
          @click="onFinish"
          icon="el-icon-check")
          | {{ $t('zavershit') }}
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
    { nm: this.$t('ne-vybrano'), v: ITaskType.NOT_CHOSEN },
    { nm: this.$t('ip-konflikt'), v: ITaskType.IP_CONFLICT },
    { nm: this.$t('zhyoltyi-treugolnik'), v: ITaskType.YELLOW_TRIANGLE },
    { nm: this.$t('krasnyi-krestik'), v: ITaskType.RED_CROSS },
    { nm: this.$t('slabaya-skorost'), v: ITaskType.WEAK_SPEED },
    { nm: this.$t('obryv-kabelya'), v: ITaskType.CABLE_BREAK },
    { nm: this.$t('podklyuchenie'), v: ITaskType.CONNECTION },
    { nm: this.$t('periodicheskoe-propadanie'), v: ITaskType.PERIODIC_DISAPPEARANCE },
    { nm: this.$t('nastroika-routera'), v: ITaskType.ROUTER_SETUP },
    { nm: this.$t('nastroika-onu'), v: ITaskType.CONFIGURE_ONU },
    { nm: this.$t('obzhat-kabel'), v: ITaskType.CRIMP_CABLE },
    // { nm: 'нет интернета', v: ITaskType.INTERNET_CRASH },
    { nm: this.$t('drugoe'), v: ITaskType.OTHER }
  ]

  private taskPriorities = [
    { nm: this.$t('nizkii'), v: ITaskPriority.LOW },
    { nm: this.$t('srednii'), v: ITaskPriority.AWARAGE },
    { nm: this.$t('vysshii'), v: ITaskPriority.HIGHER }
  ]

  private taskStates = [
    { nm: this.$t('novaya'), v: ITaskState.NEW },
    { nm: this.$t('provalena'), v: ITaskState.CONFUSED },
    { nm: this.$t('vypolnena'), v: ITaskState.COMPLETED }
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
      { required: true, message: this.$t('nado-vybrat-khotyaby-odnogo-ispolnitelya'), trigger: 'blur' }
    ],
    customer: [
      { validator: positiveNumberValueAvailable, trigger: 'blur', message: this.$t('nuzhno-vybrat-abonenta') }
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
          title: this.$t('zadachi')
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: this.$t('redaktirovat')
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
          this.$message.success(this.$t('zadacha-dobavlena'))
          this.$router.push({
            name: 'taskDetails',
            params: { taskId: newTask.id.toString() }
          })
        } else {
          await TaskModule.PatchTask(this.frmMod)
          this.frmInitial = this.fromTaskModule
          this.$message.success(this.$t('zadacha-sokhranena'))
        }
        this.loading = false
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  private onDel() {
    if (this.isNewTask) return
    this.$confirm(this.$t('zadacha-seichas-budet-udalena-vnimatelno')).then(async() => {
      await TaskModule.DelTask()
      this.$message.success(this.$t('zadacha-udalena'))
      this.$router.push({
        name: 'taskList'
      })
    })
  }

  private async onFinish() {
    if (this.isNewTask) return
    await TaskModule.FinishTask()
    this.$message.success(this.$t('zadacha-zavershena'))
    this.$router.push({
      name: 'taskList'
    })
  }
}
</script>
