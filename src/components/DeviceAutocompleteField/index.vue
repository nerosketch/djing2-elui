<template lang="pug">
  el-autocomplete.inline-input.wideautocomplete(
    v-model="inpName"
    :fetch-suggestions="querySearch"
    :loading="loading"
    placeholder="Начни вводить название или ip устройства"
    trigger-on-focus
    @select="handleSelect"
    value-key="comment"
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice } from '@/api/devices/types'
import { findDevices } from '@/api/devices/req'

@Component({
  name: 'DeviceAutocompleteField'
})
export default class extends Vue {
  private loading = false
  private inpName = ''

  @Prop({ default: '' })
  private defaultName!: string

  private querySearch(queryString: string, cb: any) {
    if(this.loading) return
    this.loading = true
    findDevices(queryString).then(({ data }) => {
      cb(data.results)
      this.loading = false
    })
  }

  private handleSelect(d: IDevice) {
    this.$emit('input', d.pk)
  }

  created() {
    this.inpName = this.defaultName
  }
}
</script>
