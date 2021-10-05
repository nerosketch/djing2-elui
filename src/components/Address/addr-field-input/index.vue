<template lang="pug">
div
  el-button(
    @click="dialogActivate"
  ) {{ fullAddrGetter }}

  el-dialog(
    title="Адрес"
    top='1%'
    :visible.sync="addrVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  )
    addr-select-form(v-model="localValue")
</template>

<script lang="ts">
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

  private dialogActivate() {
    this.addrVisible = true
  }

  get fullAddrGetter() {
    return "Полный адрес"
  }

  private handleSelect(d: IAddressModel) {
    this.$emit('input', d.id)
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number) {
    this.localValue = v
  }
}
</script>
