<template lang="pug">
  el-select(v-model="localValue" :loading='loading' :disabled="streets.length == 0")
    el-option(
      v-for="(s, i) in streets"
      :key="i"
      :value='s.id'
      :label="s.name"
    )
</template>

<script lang="ts">
import { getStreets } from '@/api/addresses/req'
import { IStreetModel } from '@/api/addresses/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'LocalityStreetChoice'
})
export default class extends Vue {
  @Prop({ default: 0 }) private localityId!: number
  @Prop({ default: 0 }) private value!: number
  
  private streets: IStreetModel[] = []
  private localValue = this.value

  private loading = false

  private async loadStreets() {
    this.loading = true
    try {
      const { data } = await getStreets({
        page: 1,
        page_size: 0,
        locality: this.localityId
      } as any) as any
      this.streets = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  @Watch('localValue')
  private onChLocVal(v: number) {
    this.$emit('input', v)
  }

  created() {
    this.loadStreets()
  }

  @Watch('localityId')
  private onChangedGroup() {
    this.loadStreets()
  }
}
</script>
