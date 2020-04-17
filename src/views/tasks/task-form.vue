<template lang="pug">
  el-form(
    :model='frmMod'
    :loading="loading"
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
          v-for="rec in recipients"
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
      label="Актуальность (дата, до которой нужно завершить задачу)"
      prop='out_date'
    )
      el-date-picker(
        v-model="frmMod.out_date"
        type="date"
        value-format="yyyy-MM-dd"
      )
    el-form-item
      el-button-group
        el-button(type="primary" @click="onSubmit" icon="el-icon-upload" size='small') Сохранить
        el-button(type="danger" @click="onDel" icon="el-icon-delete" size='small') Удалить
        el-button(type="success" @click="onFinish" icon="el-icon-check" size='small') Завершить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IProfile } from '@/api/users-types'
import { ITaskPriority, ITaskState, ITaskType, ITask } from '@/api/tasks/types'
import CustomerField from '@/components/CustomerField/index.vue'
import { TaskModule } from '@/store/modules/tasks/tasks'

@Component({
  name: 'TaskForm',
  components: { CustomerField }
})
export default class extends Vue {
  @Prop({ default: [] })
  private recipients!: IProfile[]
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
    { nm: 'нет интернета', v: ITaskType.INTERNET_CRASH },
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

  private frmMod: ITask = {
    id: TaskModule.id,
    recipients: TaskModule.recipients,
    descr: TaskModule.descr,
    priority: TaskModule.priority,
    out_date: TaskModule.out_date,
    task_state: TaskModule.task_state,
    mode: TaskModule.mode,
    author: TaskModule.author
  }

  get customerName() {
    return TaskModule.customer_full_name
  }

  private async onSubmit() {
    this.loading = true
    await TaskModule.PatchTask(this.frmMod)
    this.$message.success('Задача сохранена')
    this.loading = false
  }
  private onDel() {
    this.$confirm('Задача сейчас будет удалена, внимательно', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Не нужно',
    }).then(async () => {
      await TaskModule.DelTask(this.frmMod.id)
      this.$message.success('Задача удалена')
      this.$router.push({
        name: 'taskList'
      })
    })
  }
  private async onFinish() {
    await TaskModule.FinishTask()
    this.$message.success('Задача завершена')
    this.$router.push({
      name: 'taskList'
    })
  }
}
</script>
