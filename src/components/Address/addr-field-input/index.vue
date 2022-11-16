<template lang="pug">
div
  el-button(
    v-if="required"
    @click="dialogActivate"
  ) {{ fullTitleFromServer }}
  el-button-group.addrgrp(v-else)
    el-button.addrtext(
      @click="dialogActivate"
    ) {{ fullTitleFromServer }}
    slot(name='buttons')
    el-tooltip(
      effect="dark"
      :content="$t('clear')"
    )
      el-button(
        @click="resetVal"
        icon="el-icon-close"
        circle
      )

  el-dialog(
    :title="$t('addrs.addr')"
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
  @Prop({ default: '[notChosen]' })
  private emptyLabel!: string

  @Prop({ default: null })
  private value!: number | null

  @Prop({ default: false })
  private required!: boolean

  private localValue = this.value

  private loading = false
  private inpAddrText = ''

  private addrVisible = false
  private fullTitleFromServer = this.emptyLabel

  private dialogActivate() {
    this.addrVisible = true
  }

  private handleSelect(d: IAddressModel) {
    this.$emit('input', d.id)
  }

  private async fetchFullName(addrId: number) {
    const { data } = await getAddrFullTitle(addrId)
    this.fullTitleFromServer = data || this.emptyLabel
  }

  @Watch('localValue')
  private onChLocVal(val: number) {
    this.fetchFullName(val)
    this.$emit('input', val)
  }

  @Watch('value')
  private onChVal(v: number | null) {
    if (v && v > 0) {
      this.fetchFullName(v)
    } else {
      this.fullTitleFromServer = this.emptyLabel
    }
    this.localValue = v
  }

  created() {
    if (this.value && this.value > 0) {
      this.fetchFullName(this.value)
    }
  }

  private addrDone(val: number) {
    this.localValue = val
    this.addrVisible = false
  }

  private resetVal() {
    this.localValue = null
  }
}
</script>

<style scoped>
.addrtext {
  direction: rtl;
  overflow: hidden;
}
.addrgrp {
  display: flex;
}
</style>
