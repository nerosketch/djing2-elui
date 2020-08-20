<template lang="pug">
  el-form(
    size="mini"
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Порт"
      prop='port'
    )
      el-select(v-model="frmMod.portId")
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
        type="primary"
        @click="onSubmit"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AddVlanPort'
})
export default class extends Vue {
  private isLoading = false
  private frmMod = {
    portId: 0
  }

  private onSubmit() {
    if (this.frmMod.portId > 0) {
      this.$emit('done', this.frmMod.portId)
    }
  }
}
</script>
