<template lang="pug">
  el-select(v-model="localValue" v-loading='loading' clearable)
    el-option(
      v-for="addr in addrs"
      :key="addr.id"
      :label="`${addr.fias_address_type_name} ${addr.title}`"
      :value="addr.id"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddressModel } from '@/api/addresses/types'
import { filterByFiasLevel } from '@/api/addresses/req'

@Component({
  name: 'VarLevelAddrChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  @Prop({ required: true })
  private level!: number

  private addrs: IAddressModel[] = []

  private localValue = this.value || 0
  private loading = false

  private async loadAddrs(level: number) {
    this.loading = true
    try {
      const { data } = await filterByFiasLevel(level, 'id,title,fias_address_type_name')
      this.addrs = data
    } finally {
      this.loading = false
    }

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
  private onChLevel(level: number) {
    this.loadAddrs(level)
  }
}
</script>
