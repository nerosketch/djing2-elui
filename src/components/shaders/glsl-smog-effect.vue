<template lang="pug">
  smg(
    :width="width.toString()" :height="height.toString()"
    v-bind:u_time="uTime"
    v-bind:u_resolution="[width, height]"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import smogShader from './smog.frag'

@Component({
  name: 'GlslSmogEffect',
  components: {
    smg: smogShader
  }
})
export default class extends Vue {
  @Prop({ default: 320.0 }) private width!: number
  @Prop({ default: 240.0 }) private height!: number
  private timerTime: NodeJS.Timeout | null = null
  private uTime = 0.0

  mounted() {
    this.timerTime = setInterval(() => {
      this.uTime += 0.06;
    }, 16);
  }

  beforeDestroy() {
    if (this.timerTime) {
      clearInterval(this.timerTime)
    }
  }
}
</script>
