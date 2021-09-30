<template lang="pug">
div
  el-button(
    @click="dialogActivate"
  ) {{ fullAddrGetter }}

  el-dialog(
    title="Адрес"
    :visible.sync="addrVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  )
    addr-select-form
</template>

<script lang="ts">
// import { fetchAddrAutocomplete } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
// import { FetchSuggestionsCallback } from 'element-ui/types/autocomplete'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AddrSelectForm from './addr-select-form.vue'

@Component({
  name: 'AddrFieldInput',
  components: { AddrSelectForm }
})
export default class extends Vue {
  @Prop({ default: '' })
  private defaultAddrText!: string

  private loading = false
  private inpAddrText = ''

  private addrVisible = false

  private dialogActivate() {
    this.addrVisible = true
  }

  get fullAddrGetter() {
    return "Полный адрес"
  }

  private handleSelect(d: IAddressModel) {
    this.$emit('input', d.id)
  }
}
</script>
