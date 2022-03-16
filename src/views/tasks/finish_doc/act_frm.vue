<template lang="pug">
  el-form(
    ref='frm'
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      :label="$t('tasks.finishDoc.code')"
    )
      el-input(
        v-model="frmMod.code"
        maxlength="64"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.actNum')"
    )
      el-input(
        v-model="frmMod.act_num"
        maxlength="64"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.createTime')"
    )
      datetime-counter(
        v-model="frmMod.create_time"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.finish_time')"
    )
      el-date-picker(
        v-model="frmMod.finish_time"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="d.MM.yyyy HH:mm:ss"
      )
    el-form-item(
      :label="$t('tasks.finishDoc.cost')"
    )
      el-input(
        v-model="frmMod.cost"
        type='number'
      )
    el-form-item(
      :label="$t('tasks.modes.title')"
    )
      task-modes-field-choice(
        v-model="frmMod.task_mode"
      )
    el-form-item
      el-button-group
        el-button(
          :type="isNewDoc ? 'success' : 'primary'"
          @click="onSubmit"
          icon="el-icon-upload"
        ) {{ $t('save') }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DatetimeCounter from '@/components/datetime-counter.vue'
import TaskModesFieldChoice from '@/views/tasks/modes/modes_field_choice.vue'
import RecipientsFieldChoice from '@/views/tasks/recipients-field-choice.vue'
import { TaskFinishDocumentModule } from '@/store/modules/tasks/finish_doc'

@Component({
  name: 'ActFrm',
  components: {
    DatetimeCounter,
    TaskModesFieldChoice,
    RecipientsFieldChoice
  }
})
export default class extends Vue {
  private loading = false

  private frmMod = {
    code: '',
    act_num: null,
    create_time: null,
    finish_time: null,
    cost: 0,
    task_mode: 0,
    recipients: []
  }

  private async onSubmit() {
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
  }

  private get isNewDoc() {
    return this.$store.state.taskfinishdoc.id === 0
  }
}
</script>
