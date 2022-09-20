<template lang="pug">
el-date-picker(
  v-model="localVal"
  type="datetime"
  value-format="yyyy-MM-dd HH:mm:ss"
  format="d.MM.yyyy HH:mm:ss"
  @change="chDateTime")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'DatetimeComponent'
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
