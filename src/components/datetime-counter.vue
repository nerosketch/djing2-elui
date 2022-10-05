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


function date2String(d: Date) {
  const fm = (s: number) => `0${s}`.slice(-2)
  return `${d.getFullYear()}-${fm(d.getMonth()+1)}-${fm(d.getDate())} ${fm(d.getHours())}:${fm(d.getMinutes())}:${fm(d.getSeconds())}`
}

@Component({
  name: 'DatetimeCounter'
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

  created() {
    if (!this.value) {
      this.localVal = date2String(new Date())
      this.$emit('input', this.localVal)
    }
  }
}
</script>
