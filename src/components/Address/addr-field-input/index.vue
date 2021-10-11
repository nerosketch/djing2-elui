<template lang="pug">
div
  el-button(
    @click="dialogActivate"
  ) {{ fullTitleFromServer }}

  el-dialog(
    title="Адрес"
    top='1%'
    :visible.sync="addrVisible"
    append-to-body
  )
    addr-select-form(
      v-model="localValue"
      @done="addrDone"
    )
</template>

<script lang="ts">
import { getAddrFullTitle } from '@/api/addresses/req'
import { IAddressModel } from '@/api/addresses/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AddrSelectForm from './addr-select-form.vue'

@Component({
  name: 'AddrFieldInput',
  components: { AddrSelectForm }
})
export default class extends Vue {
  @Prop({ default: '' })
  private defaultAddrText!: string

  @Prop({ required: true })
  private value!: number

  private localValue = this.value || 0

  private loading = false
  private inpAddrText = ''

  private addrVisible = false
  private fullTitleFromServer = ''

  private dialogActivate() {
    this.addrVisible = true
  }

  private handleSelect(d: IAddressModel) {
    this.$emit('input', d.id)
  }

  private async fetchFullName(addrId: number) {
    const { data } = await getAddrFullTitle(addrId)
    this.fullTitleFromServer = data || "Полный адрес"
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.fetchFullName(val)
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.fetchFullName(v)
    this.localValue = v
  }

  created() {
    if (this.value > 0) {
      this.fetchFullName(this.value)
    }
  }

  private addrDone(val: number) {
    this.localValue = val
    this.addrVisible = false
  }
}
</script>
