<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="(type, i) in fiasTypes"
      :key="i"
      :label="type[1]"
      :value="type[0]"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddrTypeItem } from '@/api/addresses/types'
import { getFiasAddrTypes } from '@/api/addresses/req'

@Component({
  name: 'FiasTypeChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  @Prop({ default: undefined })
  private level?: number

  private fiasTypes: IAddrTypeItem[] = []

  private localValue = this.value || 0
  private loading = false

  private async loadAddrTypes() {
    this.loading = true
    try {
      const { data } = await getFiasAddrTypes(this.level)
      this.fiasTypes = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadAddrTypes()
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('level')
  private onChangeLevel(level?: number) {
    if (level && level > 0) {
      this.loadAddrTypes()
    }
  }
}
</script>
