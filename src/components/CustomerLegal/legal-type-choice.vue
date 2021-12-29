<template lang="pug">
  el-select(v-model="localValue", v-loading="loading")
    el-option(
      v-for="o in opts"
      :key="o.id"
      :value="o.value"
      :label="o.label")
</template>

<script lang="ts">
import { getLegalTypes } from '@/api/customers_legal/req'
import { IChoiceItemType } from '@/api/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'LegalTypeChoice'
})
export default class extends Vue {
  @Prop({ required: true }) private value!: number[]

  private loading = false
  private localValue = this.value
  private opts: IChoiceItemType[] = []

  @Watch('localValue')
  private onLocValChange(v: number[]) {
    this.$emit('input', v)
  }

  @Watch('value')
  private onChVal(v: number[]) {
    this.localValue = v
  }

  private async loadOpts() {
     this.loading = true
     try {
       const { data } = await getLegalTypes()
       this.opts = data
     } finally {
       this.loading = false
     }
  }

  created() {
    this.loadOpts()
  }
}
</script>
