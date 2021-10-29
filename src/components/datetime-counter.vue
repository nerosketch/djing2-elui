<template lang="pug">
  el-date-picker(
    v-model="localVal"
    type="datetime"
    value-format="yyyy-MM-dd HH:mm:ss"
    format="d.MM.yyyy HH:mm:ss"
    @change="stopTimer"
    @focus="stopTimer"
  )
</template>

<script lang="ts">
import moment from 'moment'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'DatetimeCounter'
})
export default class extends Vue {
  @Prop({ default: null })
  private value!: string | null

  private localVal = this.value
  private localTimer?: NodeJS.Timeout

  @Watch('localVal')
  private onChangeLocalVal(v: string | null) {
    this.$emit('input', v)
  }

  @Watch('value')
  private onChValue(v: string | null) {
    if (v) {
      this.stopTimer()
    }
    this.localVal = v
  }

  private stopTimer() {
    if (this.localTimer) {
      clearInterval(this.localTimer)
    }
  }

  created() {
    if (this.value) {
      this.stopTimer()
    } else {
      this.startCounter()
    }
  }

  beforeDestroy() {
    this.stopTimer()
  }

  private startCounter () {
    const fnc = () => {
      this.localVal = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    }
    this.localTimer = setInterval(fnc, 1000)
    fnc()
  }

}
</script>
