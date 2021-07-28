<template lang="pug">
  l-map(
    style="height: 100vh"
    :zoom="zoom"
    :center="center"
  )
    l-tile-layer(
      :url="url"
    )
    l-control(position="topright")
      el-card(
        v-loading='dotsLoading'
      )
        template(v-slot:header) Гео точки
        div(style="overflow:auto;height:90vh")
          .text.item(v-for="d in dots")
            el-button(
              size='mini'
            ) {{ d.title }}
    
    l-marker(
      v-for="d in dots"
      :lat-lng="[d.latitude, d.longitude]"
    )

</template>

<script lang="ts">
import '@/views/maps/leaflet'
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
// import L from 'leaflet'
import { LMap, LTileLayer, LControl, LMarker } from 'vue2-leaflet'
import ResizeMixin from '@/layout/mixin/resize'
import 'leaflet/dist/leaflet.css'
import { IMapDot } from '@/api/maps/types'
import { loadMapDots } from '@/api/maps/req'

@Component({
  name: 'MapsIndex',
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker
  }
})
export default class extends mixins(ResizeMixin) {
  private center = [45.443022, 34.738463]
  private zoom = 11
  private url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  private dotsLoading = false

  private dots: IMapDot[] = []

  private async loadDots() {
    this.dotsLoading = true
    try {
      const { data } = await loadMapDots()
      this.dots = data
    } finally {
      this.dotsLoading = false
    }
  }

  created() {
    this.loadDots()
  }
}
</script>
02t,geldwj0
