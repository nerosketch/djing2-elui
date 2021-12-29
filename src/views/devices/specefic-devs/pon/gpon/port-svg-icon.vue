<template lang="pug">
  svg(
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 14.032 14.032"
    style="enable-background:new 0 0 14.032 14.032;"
    xml:space="preserve")
    g
      g
        path(:style="frmOutlineColor", d="M12.797,0H1.234C0.553,0,0.001,0.554,0.001,1.234v11.564c0,0.681,0.554,1.234,1.234,1.234h11.563 c0.681,0,1.234-0.554,1.234-1.234V1.234C14.033,0.554,13.478,0,12.797,0z M12.881,12.798c0,0.046-0.038,0.083-0.084,0.083H1.234 c-0.046,0-0.084-0.037-0.084-0.083V1.234c0-0.046,0.038-0.083,0.084-0.083h11.563c0.046,0,0.084,0.037,0.084,0.083V12.798z")

        path(:style="frmInColor", d="M10.476,4.236H9.402V2.7c0-0.222-0.204-0.402-0.457-0.402h-3.95c-0.252,0-0.457,0.18-0.457,0.402 v1.536H3.555c-0.442,0-0.801,0.315-0.801,0.705v6.089c0,0.39,0.358,0.705,0.801,0.705h1.346v-3.98h0.686v3.98h1.086v-3.98h0.686 v3.98h1.029v-3.98h0.686v3.98h1.402c0.442,0,0.801-0.315,0.801-0.705V4.941C11.277,4.551,10.918,4.236,10.476,4.236z")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'PortSvgIcon'
})
export default class extends Vue {
  @Prop({ default: '030104' }) private outlineColor!: string
  @Prop({ default: '030104' }) private inColor!: string

  get frmOutlineColor() {
    return `fill:#${this.outlineColor};`
  }

  get frmInColor() {
    return `fill:#${this.inColor};`
  }
}
</script>
