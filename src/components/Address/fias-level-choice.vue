<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="(level, i) in fiasLevels"
      :key="i"
      :label="level.name"
      :value="level.value"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddrLevelItem } from '@/api/addresses/types'
import { getAddrLevels } from '@/api/addresses/req'

@Component({
  name: 'FiasLevelChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  private fiasLevels: IAddrLevelItem[] = []

  private localValue = this.value || 0
  private loading = false

  private async loadAddrLevels() {
    this.loading = true
    try {
      const { data } = await getAddrLevels()
      this.fiasLevels = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadAddrLevels()
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }
}
</script>
