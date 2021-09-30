<template lang="pug">
  div
    el-checkbox(
      v-for="(ic, i) in markerData"
      :key="i"
      v-model="ic[1]"
    )
      span.m-icon(:class="`m-${ic[0]}`")
    el-divider
    el-button(
      icon='el-icon-download'
      :loading='loading'
      @click='saveMarkers'
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'Markers'
})
export default class extends Vue {
  private usedMarkers: string[] = []
  private loading = false

  created() {
    this.usedMarkers = this.$store.state.customer.marker_icons
    this.setMarkerValues(this.usedMarkers)
  }

  @Watch('$store.state.customer.marker_icons', { deep: true })
  private onCustomerChanged(markers: string[]) {
    this.setMarkerValues(markers)
  }

  private setMarkerValues(active: string[]) {
    for (let i = 0; i < this.markerData.length; i++) {
      const f = this.markerData[i]
      const el = active.find(e => e === f[0])
      this.markerData[i][1] = el !== undefined
    }
  }

  private markerData: [string, boolean][] = [
    ['icon_donkey', false],
    ['icon_fire', false],
    ['icon_ok', false],
    ['icon_king', false],
    ['icon_tv', false],
    ['icon_smile', false],
    ['icon_dollar', false],
    ['icon_service', false],
    ['icon_mrk', false],
    ['icon_red_tel', false],
    ['icon_green_tel', false]
  ]

  private saveMarkers() {
    this.loading = true
    const r = this.markerData.filter(v => v[1])
    const r1 = r.flatMap(v => v[0])

    CustomerModule.SetMarkers(r1).finally(() => {
      this.loading = false
    })
  }
}
</script>
