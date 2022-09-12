<template lang="pug">
  el-select(
    v-model="localValue"
    :loading="loading"
    clearable
    :disabled="disabled"
    v-bind="$attrs")
    el-option(
      v-for="item in items"
      :key="item.id"
      :label="item.fias_address_type_name ? `${item.fias_address_type_name} ${item.title}` : item.title"
      :value="item.id")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { getAllChildren } from '@/api/addresses/req'

@Component({
  name: 'AddrChildrenChoice'
})
export default class extends Vue {
  @Prop({ required: true })
  private value!: number

  @Prop({ default: undefined })
  private parentAddrId?: number

  @Prop({ default: IAddressEnumTypes.LOCALITY })
  private addrType!: IAddressEnumTypes

  @Prop({ default: undefined })
  private parentAddrType?: IAddressEnumTypes

  @Prop({ default: false })
  private disabled!: true

  private items: IAddressModel[] = []

  private localValue = this.value || null
  private loading = false

  private async loadAddrs() {
    this.loading = true
    try {
      const { data } = await getAllChildren(
        this.addrType,
        this.parentAddrId,
        this.parentAddrType
      )
      this.items = data
    } finally {
      this.loading = false
    }
  }

  created() {
    if (!this.disabled) {
      this.loadAddrs()
    }
  }

  @Watch('localValue')
  private onChLocVal(val: number | null) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('parentAddrId')
  private onChAddr() {
    this.loadAddrs()
  }

  // private onElCh(addrId: number) {
  //   const adr = this.items.filter(a => a.id === addrId)
  //   if (adr && adr.length > 0) {
  //     this.$emit('select', adr[0])
  //   }
  // }
}
</script>
