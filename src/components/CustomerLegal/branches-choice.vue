<template lang="pug">
  el-select(v-model="localValue" multiple)
    el-option(
      v-for="o in opts"
      :key="o.id"
      :value="o.id"
      :label="o.title")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'BranchesChoice'
})
export default class extends Vue {
  @Prop({ required: true }) private value!: number[]

  private localValue = this.value
  private opts = [
    {id: 1, title: 'opt 1'},
    {id: 2, title: 'opt 2'},
    {id: 3, title: 'opt 3'},
  ]

  @Watch('localValue')
  private onLocValChange(v: number[]) {
    this.$emit('input', v)
  }

  @Watch('value')
  private onChVal(v: number[]) {
    this.localValue = v
  }
}
</script>
