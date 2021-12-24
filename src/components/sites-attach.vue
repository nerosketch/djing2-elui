<template lang="pug">
  div
    h4
      | В каких сайтах будет доступно
  
    template(v-if="sitesList.length > 0")
      el-checkbox(
        v-for="s in sitesList"
        :key="s.id"
        :label="`${s.name} (${s.domain})`"
        v-model="s.checked")
  
    span(v-else)
      i.el-icon-loading
      | Загрузка сайтов...
  
    el-divider
  
    el-button(
      icon="el-icon-upload"
      type="primary"
      @click="onSubmit"
      :disabled="!$perms.is_superuser")
      | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getSites } from '@/api/sites/req'
import { ISite } from '@/api/sites/types'

interface ISiteAttachable extends ISite {
  checked: boolean
}

@Component({
  name: 'SitesAttach'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private selectedSiteIds!: number[]
  private sitesList: ISiteAttachable[] = []

  private async loadSites() {
    const { data } = await getSites() as any
    this.sitesList = data.map(
      (site: ISite) => Object.assign({
        checked: this.selectedSiteIds.includes(site.id)
      }, site)
    )
  }

  @Watch('selectedSiteIds')
  private onChIds(ids: number[]) {
    for (const si of this.sitesList) {
      si.checked = ids.includes(si.id)
    }
  }

  created() {
    this.loadSites()
  }

  private onSubmit() {
    const selectedSites = this.sitesList.filter(s => s.checked)
    const siteIds = selectedSites.map(s => s.id)
    this.$emit('save', siteIds)
  }
}
</script>
