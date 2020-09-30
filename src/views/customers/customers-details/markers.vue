<template lang="pug">
  div
    div(
      v-for="(ic, i) in markerData"
      :key="i"
    )
      p ic {{ ic }}
      el-checkbox(v-model="ic")
      span.m-icon(
        :class="ic[0]"
      )
    p markerData {{ markerData }}
    el-divider
    el-button(size='mini' icon='el-icon-download') Patch
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'


@Component({
  name: 'Markers'
})
export default class extends Vue {
//   @Prop({ default: [] }) private allMarkers!: string[]
//   @Prop({ default: [] }) private selectedMarkers!: string[]

  private markerData = {
    'm-icon_donkey': false,
    'm-icon_fire': false,
    'm-icon_ok': false,
    'm-icon_king': false,
    'm-icon_tv': false,
    'm-icon_smile': false,
    'm-icon_dollar': false,
    'm-icon_service': false,
    'm-icon_mrk': false
  }

//   get allMarkersGetter() {
//     return Object.entries(this.markerData).map(e => (e[0]))
//   }

}
</script>
