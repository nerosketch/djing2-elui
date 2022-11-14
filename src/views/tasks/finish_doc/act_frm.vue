<template lang="pug">
  el-form(
    ref='frm'
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      :label="$t('tasks.finishDoc.actNum')"
      prop="code"
    )
      el-input(
        v-model="frmMod.code"
        maxlength="64"
      )
    //- el-form-item(
    //-   :label="$t('')"
    //- )
    //-   el-input(
    //-     v-model="frmMod.act_num"
    //-     maxlength="64"
    //-   )
    el-form-item(
      :label="$t('tasks.finishDoc.createTime')"
      prop="create_time"
    )
      datetime-counter(
        v-model="frmMod.create_time"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.finish_time')"
      prop="finish_time"
    )
      el-date-picker(
        v-model="frmMod.finish_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="d.MM.yyyy HH:mm:ss"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.cost')"
      prop="cost"
    )
      el-input(
        v-model="frmMod.cost"
        type='number'
      )
    el-form-item(
      :label="$t('tasks.natureOfFracture')"
      prop="task_mode_id"
    )
      task-modes-field-choice(
        v-model="frmMod.task_mode_id"
      )
    el-form-item(:label="$t('tasks.implementers')" prop="recipients")
      recipients-field-choice(
        :recipients="recipients"
        v-model="frmMod.recipients"
      )
    el-form-item
      el-button-group
        el-button(
          :type="isNewDoc ? 'success' : 'primary'"
          @click="onSubmit"
          icon="el-icon-upload"
        ) {{ isNewDoc ? $t('add') : $t('save') }}

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import DatetimeCounter from '@/components/datetime-counter.vue'
import TaskModesFieldChoice from '@/views/tasks/modes/modes_field_choice.vue'
import RecipientsFieldChoice from '@/views/tasks/recipients-field-choice.vue'
import { TaskFinishDocumentModule } from '@/store/modules/tasks/finish_doc'
import { ITaskFinishDocument } from '@/api/tasks/types'
import {
  positiveNumberValueAvailable,
  positiveValidator,
  datetimeTimeValidator
} from '@/utils/validate'
import { IUserProfile } from '@/api/profiles/types'

interface IFrmMod {
  code: string
  // act_num: string | null
  task_id: number
  create_time: string
  finish_time: string
  cost: number
  task_mode_id: number
  recipients: number[]
}

@Component({
  name: 'ActFrm',
  components: {
    DatetimeCounter,
    TaskModesFieldChoice,
    RecipientsFieldChoice
  }
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  @Prop({ default: [] })
  private recipients!: IUserProfile[]

  private loading = false

  private frmMod: IFrmMod = {
    code: this.$store.state.taskfinishdoc.code,
    // act_num: this.$store.state.taskfinishdoc.act_num,
    task_id: this.$store.state.taskfinishdoc.task_id,
    create_time: this.$store.state.taskfinishdoc.create_time,
    finish_time: this.$store.state.taskfinishdoc.finish_time,
    cost: this.$store.state.taskfinishdoc.cost,
    task_mode_id: this.$store.state.taskfinishdoc.task_mode_id,
    recipients: this.$store.state.taskfinishdoc.recipients
  }

  @Watch('$store.state.taskfinishdoc', { deep: true })
  private onChFinDoc(finDoc: ITaskFinishDocument) {
    const fm = this.frmMod
    fm.code = finDoc.code
    // fm.act_num = finDoc.act_num
    fm.task_id = finDoc.task_id
    fm.create_time = finDoc.create_time
    fm.finish_time = finDoc.finish_time
    fm.cost = finDoc.cost
    fm.task_mode_id = finDoc.task_mode_id
    fm.recipients = finDoc.recipients
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNewDoc) {
            const newDoc = await TaskFinishDocumentModule.AddFinishDoc(this.frmMod)
            this.$message.success(this.$tc('tasks.finishDoc.added'))
            this.$emit('created', newDoc)
          } else {
            const doc = await TaskFinishDocumentModule.PatchFinishDoc(this.frmMod)
            this.$message.success(this.$tc('tasks.finishDoc.changed'))
            this.$emit('changed', doc)
          }
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }

  private get isNewDoc() {
    return this.$store.state.taskfinishdoc.id === 0
  }

  private frmRules = {
    code: [
      { required: true, trigger: 'blur' }
    ],
    create_time: [
      { required: true, trigger: 'blur' },
      { trigger: 'change', message: this.$tc('tasks.finishDoc.dateTimeReq'), validator: datetimeTimeValidator }
    ],
    finish_time: [
      { required: true, trigger: 'blur' },
      { trigger: 'change', message: this.$tc('tasks.finishDoc.dateTimeReq'), validator: datetimeTimeValidator }
    ],
    cost: [
      { required: true, validator: positiveValidator, trigger: 'blur' }
    ],
    recipients: [
      { required: true, message: this.$tc('tasks.weHaveToChooseOnePerpetrator'), trigger: 'blur' }
    ],
    task_mode_id: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'blur' }
    ]
  }
}
</script>
