<template lang="pug">
  span(
    @click="toInput"
    v-if="isPlain"
  ) - "{{ localValue }}"
  el-input(
    v-else
    v-model="localValue"
    @blur="toPlain"
    ref='inp'
  )
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Input } from 'element-ui'

@Component({
  name: 'InputLabel'
})
export default class extends Vue {
  public readonly $refs!: {
    inp: Input
  }
  @Prop({ required: true }) private value!: string

  private isPlain = true
  private localValue = this.value

  @Watch('localValue')
  private onChLocVal(v: string) {
    this.$emit('input', v)
  }

  @Watch('value')
  private onChVal(v: string) {
    this.localValue = v
  }

  private async toInput() {
    this.isPlain = false
    await this.$nextTick()
    this.$refs.inp.focus()
    this.$refs.inp.select()
  }
  private toPlain() {
    this.isPlain = true
  }
}
</script>

<style scoped>
.el-input {
  width: fit-content;
}
</style>
