<template lang="pug">
  div
    p Поля, отмеченные галками, будут видны.

    template(v-if="colsLoc.length > 0")
      el-checkbox(
        v-for="(col, i) in colsLoc"
        :key="i"
        :label="col.label"
        v-model="col.visible")

    el-divider

    el-button(
      icon="el-icon-upload"
      type="primary"
      @click="saveFieldsVisible")
      | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { ILocalDataTableColumn } from './index.vue'

@Component({
  name: 'DatatableEditFields'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private columns!: ILocalDataTableColumn[]
  @Prop({ default: null }) private storePrefix?: string
  private colsLoc: ILocalDataTableColumn[] = []

  created() {
    this.colsLoc = JSON.parse(JSON.stringify(this.columns))
  }

  @Watch('colsLoc')
  private onChColsLoc(cols: ILocalDataTableColumn) {
    this.$emit('update:columns', cols)
  }

  private saveFieldsVisible() {
    if (this.storePrefix !== null) {
      for (const col of this.colsLoc) {
        localStorage.setItem(`${this.storePrefix}_visible_${col.prop}`, col.visible ? '1' : '0')
      }
    }
    this.$emit('done')
  }
}
</script>
