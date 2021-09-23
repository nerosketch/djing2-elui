<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="(at, i) in addrTypes"
      :key="i"
      :label="at.label"
      :value="at.value"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddressType } from '@/api/addresses/types'
import { getAddrTypes } from '@/api/addresses/req'

@Component({
  name: 'AddressTypeChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  private addrTypes: IAddressType[] = []

  private localValue = this.value
  private loading = false

  private async loadAddrTypes() {
    this.loading = true
    try {
      const { data } = await getAddrTypes()
      this.addrTypes = data
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
}
</script>
