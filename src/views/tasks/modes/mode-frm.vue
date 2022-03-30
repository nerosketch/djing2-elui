<template lang="pug">
  el-form(
    :model="frmMod"
    v-loading="loading"
  )
    el-form-item(
      :label="$t('title')"
      prop="title"
    )
      el-input(
        v-model="frmMod.title"
        maxlength="64"
      )
    el-form-item
      el-button(
        :type="isNewMode ? 'success' : 'primary'"
        @click="onSubmit"
        icon="el-icon-upload"
      ) {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TaskModeModule } from '@/store/modules/tasks/modes'

@Component({
  name: 'ModeFrm'
})
export default class extends Vue {
  private frmMod = {
    title: this.$store.state.taskmode.title
  }

  @Watch('$store.state.taskmode.title')
  private onChTitle(title: string) {
    this.frmMod.title = title
  }

  private loading = false

  private async onSubmit() {
    this.loading = true
    try {
      if (this.isNewMode) {
        const newMode = await TaskModeModule.AddTaskMode(this.frmMod.title)
        this.$message.success(this.$tc('tasks.modes.added'))
        this.$emit('created', newMode)
      } else {
        const mode = await TaskModeModule.SaveTaskMode(this.frmMod.title)
        this.$message.success(this.$tc('tasks.modes.changed'))
        this.$emit('changed', mode)
      }
    } finally {
      this.loading = false
    }
  }

  private get isNewMode() {
    return this.$store.state.taskmode.id === 0
  }
}
</script>
