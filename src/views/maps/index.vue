<template lang="pug">
  l-map(
    style="height: 100vh"
    :zoom="zoom"
    :center="center"
  )
    l-tile-layer(
      :url="url"
    )

</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component, Vue } from 'vue-property-decorator'
// import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import ResizeMixin from '@/layout/mixin/resize'
import 'leaflet/dist/leaflet.css'

@Component({
  name: 'MapsIndex',
  components: {
    LMap,
    LTileLayer,
    LMarker,
  }
})
export default class extends mixins(ResizeMixin) {
  private center = [47.313220, -1.319482]
  private zoom = 8
  private url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
}
</script>
