<template lang="pug">
  smg(
    :width="width.toString()" :height="height.toString()"
    v-bind:u_time="uTime"
    v-bind:u_resolution="[width, height]"
  )
</template>

<script>
import smogShader from "./smog.frag";
export default {
  name: "smog",
  components: {
    smg: smogShader
  },
  props: {
    width: {
      type: Number,
      default: 320.0
    },
    height: {
      type: Number,
      default: 240.0
    }
  },
  mounted() {
    this.timerTime = setInterval(() => {
      this.uTime += 0.06;
    }, 16);
  },
  data() {
    return {
      uTime: 0.0,
      timerTime: 0
    };
  },
  beforeDestroy() {
    clearInterval(this.timerTime);
  }
};
</script>
