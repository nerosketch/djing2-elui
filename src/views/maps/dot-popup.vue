<template lang="pug">
div(v-loading="devsLoading")
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
import { IMapDot, IMapDotDevice } from '@/api/maps/types'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'DotPopup'
})
export default class extends Vue {
  @Prop({ required: true })
  private dot!: IMapDot

  private devsLoading = false
  private devsList: IMapDotDevice[] = []

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

  created() {
    this.loadDevs(this.dot.id)
  }

  @Watch('dot', {deep: true})
  private onDotChanged(dot: IMapDot) {
    this.loadDevs(dot.id)
  }
}
</script>

<style scoped>
.text.item, b.tooltitle {
  display: block;
}
</style>