<template lang="pug">
  el-autocomplete.inline-input.wideautocomplete(
    v-model="inpName"
    :fetch-suggestions="querySearch"
    :loading="loading"
    placeholder="Начни вводить адрес"
    trigger-on-focus
    @select="handleSelect"
    value-key="title"
  )
</template>

<script lang="ts">
import { fetchAddrAutocomplete } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { FetchSuggestionsCallback } from 'element-ui/types/autocomplete'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'AddrFieldInput'
})
export default class extends Vue {
  @Prop({ default: '' })
  private defaultAddrText!: string

  private loading = false
  private inpAddrText = ''

  private async querySearch(queryString: string, cb: FetchSuggestionsCallback) {
    if (this.loading) return
    this.loading = true
    const { data } = await fetchAddrAutocomplete(queryString)
    cb(data)
    this.loading = false
  }

  private handleSelect(d: IAddressModel) {
    this.$emit('input', d.id)
  }

  @Watch('defaultAddrText')
  private onChangedDefaultName(name: string) {
    this.inpAddrText = name
  }

  mounted() {
    this.onChangedDefaultName(this.defaultAddrText)
  }
}
</script>
