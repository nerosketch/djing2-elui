<template lang="pug">
  el-autocomplete.inline-input.wideautocomplete(
    v-model="inpName"
    :fetch-suggestions="querySearch"
    :loading="loading"
    placeholder="Начни вводить название или ip оборудования"
    trigger-on-focus
    @select="handleSelect"
    value-key="comment")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { findDevices } from '@/api/devices/req'
import { FetchSuggestionsCallback } from 'element-ui/types/autocomplete'

@Component({
  name: 'DeviceAutocompleteField'
})
export default class extends Vue {
  private loading = false
  private inpName = ''

  @Prop({ default: '' })
  private defaultName!: string

  private async querySearch(queryString: string, cb: FetchSuggestionsCallback) {
    if (this.loading) return
    this.loading = true
    const { data } = await findDevices(queryString)
    cb(data.results)
    this.loading = false
  }

  private handleSelect(d: IDevice) {
    this.$emit('input', d.id)
  }

  @Watch('defaultName')
  private onChangedDefaultName(name: string) {
    this.inpName = name
  }

  mounted() {
    this.onChangedDefaultName(this.defaultName)
  }
}
</script>
