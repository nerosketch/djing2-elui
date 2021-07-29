<template lang="pug">
  l-map(
    style="height: 100vh"
    :zoom="zoom"
    :center="center"
    :options="opts"
    @dblclick="mapDblClick"
  )
    l-tile-layer(:url="url")
    l-control(position="topright")
      el-card(
        v-loading='dotsLoading'
        :body-style="{padding: '0'}"
      )
        template(v-slot:header) Гео точки
        #dot-list(style="overflow:auto;height:90vh")
          a.text.item(
            v-for="d in dots"
            href='#'
            @click="dotClick(d)"
          ) {{ d.title }}
        el-button(
          size='mini'
          icon='el-icon-refresh'
          type='primary'
          @click="loadDots"
        ) Обновить

    dot-map(
      v-for="d in dots"
      :dot='d'
      @done="delDotDone"
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
import { LMap, LTileLayer, LControl } from 'vue2-leaflet'
import ResizeMixin from '@/layout/mixin/resize'
import 'leaflet/dist/leaflet.css'
import { IMapDot } from '@/api/maps/types'
import { loadMapDots } from '@/api/maps/req'
import DotForm from './dot-form.vue'
import DotMap from './dot-map.vue'

@Component({
  name: 'MapsIndex',
  components: {
    LMap,
    LTileLayer,
    LControl,
    DotForm,
    DotMap,
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
    this.latLon.lat = a.latlng.lat
    this.latLon.lon = a.latlng.lng
    this.formVisible = true
  }

  private addDotDone(dot: IMapDot) {
    this.formVisible = false
    this.$message.success('Новая точка добавлена')
    this.loadDots()
  }

  private dotClick(dot: IMapDot) {
    this.center = [dot.latitude, dot.longitude]
  }

  private delDotDone() {
    this.$message.success('Точка удалена')
    this.loadDots()
  }
}
</script>

<style scoped>
#dot-list .text.item {
  border-bottom: 1px solid #d2d2d2;
  padding: 3px 11px;
  display: block;
  color: #1d1d1d;
}

#dot-list .text.item:hover {
  color: #495057;
  background-color: #f8f9fa;
}
#dot-list .text.item:active {
  color: #303030;
  background-color: #dfdfdf;
}
</style>