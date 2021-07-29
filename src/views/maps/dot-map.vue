<template lang="pug">
l-marker(
  :lat-lng="[dot.latitude, dot.longitude]"
  @popupopen="popop"
  @popupclose='popclo'
  :icon='markerIcon'
)
  l-popup(
    v-loading="devsLoading"
  )
    template(v-if="isDevsListVisible")
      b.tooltitle {{ dot.title }}
      router-link.text.item(
        target='_blank'
        v-for="dev in devsList"
        :to="{name: 'device-view', params: { devId: dev.pk }}"
      ) {{ dev.comment }}
    el-button(
      size='mini'
      type='danger'
      icon='el-icon-close'
      @click="delDot(dot)"
    )
</template>

<script lang="ts">
import { delMapDot, loadDotDevs } from '@/api/maps/req'
import { LPopup, LMarker } from 'vue2-leaflet'
import { IMapDot, IMapDotDevice } from '@/api/maps/types'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import MapDotIcons from './icons'

@Component({
  name: 'DotMap',
  components: {
    LPopup,
    LMarker
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private dot!: IMapDot

  private devsLoading = false
  private devsList: IMapDotDevice[] = []
  private isDevsListVisible = false

  get markerIcon() {
    return MapDotIcons.skyrimIcon
  }

  private delDot(dot: IMapDot) {
    this.$alert('Удалить точку?').then(async() => {
      await delMapDot(dot.id)
      this.$emit('done')
    })
  }

  private async loadDevs(dotId: number) {
    this.devsLoading = true
    try {
      const { data } = await loadDotDevs(dotId)
      this.devsList = data
    } finally {
      this.devsLoading = false
    }
  }

  @Watch('isDevsListVisible')
  private onDotChanged(isVisible: boolean) {
    if (isVisible && this.dot.id) {
      this.loadDevs(this.dot.id)
    }
  }

  private popop() {
    this.isDevsListVisible = true
  }

  private popclo() {
    this.isDevsListVisible = false
  }
}
</script>

<style scoped>
.text.item, b.tooltitle {
  display: block;
}
</style>