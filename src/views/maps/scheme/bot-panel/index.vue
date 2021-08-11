<template lang="pug">
el-card(shadow="hover" :body-style="{ padding: '10px 20px' }")
  template(v-slot:header) Панель инструментов
  el-button-group
    el-button(
      icon='el-icon-s-finance'
      :loading="loading"
      @click="saveMap"
    ) Save
</template>

<script lang="ts">
import { putScheme } from '@/api/maps/req'
import Drawflow from 'drawflow'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'BotPanel'
})
export default class extends Vue {
  @Prop({ default: null })
  private editor?: Drawflow

  private loading = false

  private saveMap() {
    if (!this.editor) return

    this.loading = true
    const data = this.editor.export()
    putScheme(data).finally(() => {
      this.loading = false
    })
  }
}
</script>
