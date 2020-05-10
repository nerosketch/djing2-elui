<template lang="pug">
  el-card.box-card
    template(v-slot:header)
      .clearfix
        span {{ devTitle || 'BDCOM' }}
    el-table(
      :data="items"
      border fit size='small'
    )
      template(v-slot:empty)
        el-progress.disable_animations(
          :percentage="loadPercent"
        )
      el-table-column(
        label="#"
        width="50"
      )
        template(v-slot:default="{row}")
          i.el-icon-success.el-alert--success.is-light(v-if="row.status")
          i.el-icon-error.el-alert--error.is-light(v-else)
      el-table-column(
        label="SNMP Ном."
      )
        template(v-slot:default="{row}") {{ row.number }}
      el-table-column(
        label="Имя"
      )
        template(v-slot:default="{row}") {{ row.title }}
      el-table-column(
        label="Мак"
      )
        template(v-slot:default="{row}") {{ row.mac_addr }}
      el-table-column(
        label="Ур. сигнала"
      )
        template(v-slot:default="{row}") {{ row.signal }}
      el-table-column(
        label="В сети"
      )
        template(v-slot:default="{row}") {{ row.uptime }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { scanOnuList } from '@/api/devices/req'
import { IScannedONU } from '@/api/devices/types'
import { IDataTableColumn } from '@/components/Datatable/index.vue'

@Component({
  name: 'PonBdcomOlt'
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: null }) private devTitle!: string
  private loading = false
  private loadPercent = 0
  private items: IScannedONU[] = []

  private fetchItems() {
    this.loading = true
    scanOnuList(this.devId, (c: ProgressEvent) => {
      this.loadPercent = Math.floor((100 * c.loaded) / c.total)
    }).then(({ data }) => {
      for (const line of data.split('\n')) {
        try {
          this.items.push(JSON.parse(line))
        } catch (e) {
          continue
        }
      }
    }).finally(() => {
      this.loading = false
    })
  }

  created() {
    if (this.devId > 0) {
      this.fetchItems()
    }
  }
}
</script>

<style>
.disable_animations * {
  transition: none !important;
}
</style>
