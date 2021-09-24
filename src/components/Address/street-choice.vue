<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="str in streets"
      :key="str.id"
      :label="str.title"
      :value="str.id"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddressModel } from '@/api/addresses/types'
import { getStreets } from '@/api/addresses/req'

@Component({
  name: 'AddressStreetChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  @Prop({ default: 0 })
  private addrId!: number

  private streets: IAddressModel[] = []

  private localValue = this.value || 0
  private loading = false

  private async loadAddrStreets() {
    this.loading = true
    try {
      const { data } = await getStreets(this.addrId) as any
      this.streets = data
      this.localValue = data[0].id
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadAddrStreets()
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('addrId')
  private onChAddr() {
    this.loadAddrStreets()
  }
}
</script>
