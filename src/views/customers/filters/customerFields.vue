<template lang="pug">
el-select(v-model="localValue")
  el-option(
    v-for="f in $store.getters.allCustomerFields"
    :key="f.l"
    :value='f.l'
    :label="f.l"
  )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'CustomerFields'
})
export default class extends Vue {
  @Prop({ required: true }) private value!: string

  private localValue = this.value

  @Watch('value')
  private onChVal(v: string) {
    this.localValue = v
  }

  @Watch('localValue')
  private onChLocVal(v: string) {
    this.$emit('input', v)
  }
}
</script>
