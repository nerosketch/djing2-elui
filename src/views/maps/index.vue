<template lang="pug">
  l-map(
    style="height: 100vh"
    :zoom="zoom"
    :center="center"
    :options="opts"
    @dblclick="mapDblClick"
  )
    l-tile-layer(
      :url="url"
    )
    l-control(
      position="topright"
    )
      el-card(v-loading='dotsLoading')
        template(v-slot:header) Гео точки
        div(style="overflow:auto;height:90vh")
          .text.item(v-for="d in dots")
            el-button(
              size='mini'
            ) {{ d.title }}
        el-button-group
          el-button(
            size='mini'
            type='success'
            icon='el-icon-plus'
          ) Добавить
          el-button(
            size='mini'
            icon='el-icon-refresh'
            type='primary'
            @click="loadDots"
          ) Обновить

    l-marker(
      v-for="d in dots"
      :lat-lng="[d.latitude, d.longitude]"
    )
      l-popup
          b header
          .text.item askdhasjkd
          .text.item sdsdfergte
          .text.item ioasiopasd
          .text.item mjqwklqklf
          el-button-group
            el-button(
              size='mini'
              type='danger'
              icon='el-icon-close'
            )

    el-dialog(:visible.sync="formVisible")
      dot-form(
        :lat="latLon.lat"
        :lon="latLon.lon"
        @done="addDotDone"
      )

</template>

<script lang="ts">
import '@/views/maps/leaflet'
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
// import L from 'leaflet'
import { LMap, LTileLayer, LControl, LMarker, LPopup } from 'vue2-leaflet'
import ResizeMixin from '@/layout/mixin/resize'
import 'leaflet/dist/leaflet.css'
import { IMapDot } from '@/api/maps/types'
import { loadMapDots } from '@/api/maps/req'
import DotForm from './dot-form.vue'

@Component({
  name: 'MapsIndex',
  components: {
    LMap,
    LTileLayer,
    LControl,
    LMarker,
    DotForm,
    LPopup
  }
})
export default class extends mixins(ResizeMixin) {
  private center = [45.443022, 34.738463]
  private zoom = 11
  private url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  private dotsLoading = false
  private formVisible = false
  private latLon = {
    lat: 0,
    lon: 0
  }

  private dots: IMapDot[] = []

  private opts = {
    doubleClickZoom: false,
    scrollWheelZoom: false
  }

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

  private mapDblClick(a: any) {
    // console.log('mapDblClick', a, typeof a, this.latLon)
    this.latLon.lat = a.latlng.lat
    this.latLon.lon = a.latlng.lng
    this.formVisible = true
  }

  private addDotDone(dot: IMapDot) {
    // console.log('done', dot)
    this.formVisible = false
    this.$message.success('Новая точка добавлена')
    this.loadDots()
  }
}
</script>
