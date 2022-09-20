<template lang="pug">
el-select(v-model="localValue")
  el-option(
    v-for="f in customerFields"
    :key="f.v"
    :value='f.v'
    :label="f.l"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { CustomerField } from '@/api/customers/types'

@Component({
  name: 'CustomerFkFields'
})
export default class extends Vue {
  @Prop({ required: true }) private value!: number

  public customerFields: CustomerField[] = this.$store.state.customerfilters.customerFkFields

  private localValue = this.value

  @Watch('$store.state.customerfilters.customerFkFields')
  private onChCusFields(cf: CustomerField[]) {
    this.customerFields = cf
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('localValue')
  private onChLocVal(v: number) {
    this.$emit('input', v)
  }
}
</script>
