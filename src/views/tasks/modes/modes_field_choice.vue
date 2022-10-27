<template lang="pug">
  el-select(
    v-model="localValue"
    :loading="loading"
  )
    el-option(
      :label="$t('notChosen')"
      :value="0"
    )
    el-option(
      v-for="mode in modes"
      :key="mode.id"
      :label="mode.title"
      :value="mode.id")
</template>

<script lang="ts">
import { getModes } from '@/api/tasks/req'
import { ITaskMode } from '@/api/tasks/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'TaskModesFieldChoice'
})
export default class extends Vue {
  private loading = false
  private modes: ITaskMode[] = []

  @Prop({ required: true })
  private value!: number

  private localValue = 0

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  private async loadModes() {
    this.loading = true
    try {
      const { data } = await getModes() as any
      this.modes = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadModes()
    if (this.value) {
      this.localValue = this.value
    }
  }
}
</script>
