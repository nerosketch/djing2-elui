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
import { getCustomerFields } from './api/req'
import { CustomerField } from './api/types'

@Component({
  name: 'CustomerFields'
})
export default class extends Vue {
  @Prop({ required: true }) private value!: number

  public customerFields: CustomerField[] = []

  private localValue = this.value

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }

  @Watch('localValue')
  private onChLocVal(v: number) {
    this.$emit('change', v)
  }

  async created() {
    console.log('Load fields')
    // TODO: Вызывается при каждом создании компонента, плохо
    const { data } = await getCustomerFields()
    this.customerFields = data
  }
}
</script>
