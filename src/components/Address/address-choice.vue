<template lang="pug">
  el-select(v-model="localValue" :loading='loading')
    el-option(
      v-for="loc in localities"
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
  private localities: IAddressModel[] = []
  @Prop({ required: true })
  private value!: number

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
      this.localities = data
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadAddresses()
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }
}
</script>
