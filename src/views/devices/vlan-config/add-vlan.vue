<template lang="pug">
  el-form(
    size="mini"
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Vlan"
      prop='vlan'
    )
      el-select(v-model="frmMod.vid")
        el-option(
          v-for="v in vlans"
          :key="v.id"
          :label="`${v.title} [${v.vid}]`"
          :value="v.vid"
        )
    el-form-item(
      label="Режим Trunk/Access"
      prop='native'
    )
      el-switch(
        v-model="frmMod.native"
        active-text="Access"
        inactive-text="Trunk"
      )
    el-form-item
      el-button(
        type="success"
        icon='el-icon-plus'
        @click="onSubmit"
      ) Добавить
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IDevOnuVlan } from '@/api/devices/types'
import { IVlanIf } from '@/api/networks/types'

@Component({
  name: 'AddVlan'
})
export default class extends Vue {
  @Prop({ default: [] }) private vlans!: IVlanIf[]
  private isLoading = false
  private frmMod: IDevOnuVlan = {
    vid: 0,
    native: false
  }

  private onSubmit() {
    if (this.frmMod.vid > 0) {
      this.$emit('done', JSON.parse(JSON.stringify(this.frmMod)))
    }
  }
}
</script>
