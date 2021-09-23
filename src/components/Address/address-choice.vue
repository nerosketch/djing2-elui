<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="addr in addrs"
      :key="addr.id"
      :label="addr.title"
      :value="addr.id"
    )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { IAddressModel } from '@/api/addresses/types'
import { getAddresses } from '@/api/addresses/req'

@Component({
  name: 'AddressChoice'
})
export default class extends Vue {
  @Prop({ default: () => ([]) })
  private availableAddresses!: IAddressModel[]

  @Prop({ required: true })
  private value!: number

  private addrs: IAddressModel[] = this.availableAddresses

  private localValue = this.value || null
  private loading = false

  private async loadAddresses() {
    this.loading = true
    try {
      const { data } = await getAddresses({
        fields: 'id,title,parent_addr,address_type',
        page: 1,
        page_size: 0
      }) as any
      this.addrs = data
    } finally {
      this.loading = false
    }
  }

  created() {
    if (this.availableAddresses.length < 1) {
      this.loadAddresses()
    }
  }

  @Watch('availableAddresses')
  private onChAvAddrs(addrs: IAddressModel[]) {
    this.addrs = addrs
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }
}
</script>
