<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="loc in addrs"
      :key="loc.id"
      :label="loc.title"
      :value="loc.id"
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

  private localValue = this.value
  private loading = false

  private async loadAddresses() {
    this.loading = true
    try {
      const { data } = await getAddresses({
        fields: 'id,title',
        page: 1,
        page_size: 0
      }) as any
      this.addrs = data
    } finally {
      this.loading = false
    }
  }

  created() {
    if (this.availableAddresses.length === 0) {
      this.loadAddresses()
    }
  }

  @Watch('availableAddresses')
  private onChAvAddrs(addrs: IAddressModel[]) {
    this.addrs = addrs
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }
}
</script>
