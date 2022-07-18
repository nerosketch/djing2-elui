<template lang="pug">
  el-date-picker(
    v-model="localVal"
    type="datetime"
    value-format="yyyy-MM-dd HH:mm:ss"
    format="d.MM.yyyy HH:mm:ss"
    @change="chDateTime"
    @focus="stopTimer")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'DatetimeCounter'
})
export default class extends Vue {
  @Prop({ default: null })
  private value!: string | null

  private localVal = this.value
  private localTimer?: NodeJS.Timeout

  @Watch('value')
  private onChValue(v: string | null) {
    if (v) {
      this.stopTimer()
    }
    this.localVal = v
  }

  private chDateTime(val: string) {
    this.stopTimer()
    this.$emit('input', val)
  }

  private stopTimer() {
    if (this.localTimer) {
      clearInterval(this.localTimer)
    }
  }

  created() {
    if (this.value) {
      this.stopTimer()
    }
    this.startCounter()
  }

  beforeDestroy() {
    this.stopTimer()
  }

  private startCounter () {
    const fm = (s: number) => `0${s}`.slice(-2)
    const fnc = () => {
      const d = new Date()
      this.localVal = `${d.getFullYear()}-${fm(d.getMonth()+1)}-${fm(d.getDate())} ${fm(d.getHours())}:${fm(d.getMinutes())}:${fm(d.getSeconds())}`
    }
    this.localTimer = setInterval(fnc, 1000)
    fnc()
  }

}
</script>
