<template lang="pug">
el-date-picker(
  v-model="localVal"
  type="date"
  value-format="yyyy-MM-dd"
  format="d.MM.yyyy"
  @change="chDateTime")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'DateComponent'
})
export default class extends Vue {
  @Prop({ default: null })
  private value!: string | null

  private localVal = this.value

  @Watch('value')
  private onChValue(v: string | null) {
    this.localVal = v
  }

  private chDateTime(val: string) {
    this.$emit('input', val)
  }
}
</script>
