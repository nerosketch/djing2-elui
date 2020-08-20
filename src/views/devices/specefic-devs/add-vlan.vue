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
      el-select(v-model="frmMod.vlanId")
        el-option(
          label="OIoi"
          :value="1"
        )
        el-option(
          label="sdjfosdf"
          :value="2"
        )
    el-form-item
      el-button(
        type="success"
        icon='el-icon-plus'
        @click="onSubmit"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AddVlan'
})
export default class extends Vue {
  private isLoading = false
  private frmMod = {
    vlanId: 0
  }

  private onSubmit() {
    if (this.frmMod.vlanId > 0) {
      this.$emit('done', this.frmMod.vlanId)
    }
  }
}
</script>
