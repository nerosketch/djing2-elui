<template lang="pug">
  el-card.box-card
    template(v-slot:header)
      .clearfix
        span {{ devTitle || 'BDCOM' }}
    el-row(v-if="ready")
      el-col(
        :span='24'
        v-for="(fiber, i) in fibers"
      )
        el-card(shadow="never")
          template(v-slot:header)
            .clearfix
              span {{ fiber.fb_name }} ({{ fiber.fb_active_onu }}/{{ fiber.fb_onu_num }})
          el-table(
            :data="fiber.onuList"
            border fit size='small'
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
    el-progress.disable_animations(
      v-else
      :percentage="loadPercent"
    )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { scanOnuList, scanOltFibers } from '@/api/devices/req'
import { IScannedONU, IDevFiber } from '@/api/devices/types'
import { IDataTableColumn } from '@/components/Datatable/index.vue'

interface IDevFiberLocal extends IDevFiber {
  onuList: IScannedONU[]
}

@Component({
  name: 'PonBdcomOlt'
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: null }) private devTitle!: string
  private loading = false
  private ready = false
  private loadPercent = 0
  private fibers: IDevFiberLocal[] = []

  private fetchItems() {
    return scanOnuList(this.devId, (c: ProgressEvent) => {
      this.loadPercent = Math.floor((100 * c.loaded) / c.total)
    }).then(({ data }) => {
      for (const line of data.split('\n')) {
        try {
          let onu = JSON.parse(line) as IScannedONU
          const fibIndex = this.fibers.findIndex((fb: IDevFiber) => fb.fb_id === onu.fiberid)
          if (fibIndex !== undefined) {
            this.fibers[fibIndex].onuList.push(onu)
          }
        } catch (e) {
          continue
        }
      }
      this.ready = true
    })
  }

  private fetchFibers() {
    return scanOltFibers(this.devId).then(({ data }) => {
      for (const fib of data) {
        this.fibers.push(Object.assign({onuList: new Array()}, fib) as IDevFiberLocal)
      }
    })
  }

  private loadAll() {
    this.loading = true
    this.ready = false
    if (this.devId > 0) {
      return this.fetchFibers().then(() => {
        this.fetchItems()
      }).finally(() => {
        this.loading = false
      })
    }
    throw new Error('devId is required')
  }

  created() {
    this.loadAll()
  }
}
</script>

<style>
.disable_animations * {
  transition: none !important;
}
</style>
