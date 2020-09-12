<template lang="pug">
span
  //- span Температура глаза: { { port.fb_temp }} C&deg; / ток лазера { { port.fb_power }} mA.
  el-table(
    :data="onuList"
    v-loading="lloading"
    :row-class-name="onuRowColor"
    border fit size='small'
  )
    el-table-column(
      label="Тип"
      min-width="80"
    )
      template(v-slot:default="{row}") {{ row.onu_type }}
    el-table-column(
      label="Порт"
      min-width="90"
    )
      template(v-slot:default="{row}") {{ row.onu_port }}
    el-table-column(
      label="Сигнал"
      min-width="90"
    )
      template(v-slot:default="{row}") {{ row.onu_signal }}
    el-table-column(
      label="Серийник"
      min-width="90"
    )
      template(v-slot:default="{row}") {{ row.onu_sn }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IScannedZTEONU, IDevFiber } from '@/api/devices/types'
import { scanFiberOnuList } from '@/api/devices/req'

interface ITableRowClassName {
  row: IScannedZTEONU
  rowIndex: number
}

@Component({
  name: 'OnuOnFiber'
})
export default class extends Vue {
  @Prop({ default: 0 }) private devId!: number
  @Prop({ default: 0 }) private fiberAddr!: number
  private onuList: IScannedZTEONU[] = []
  private lloading = false

  @Watch('fiberAddr')
  private onChFibAddr(addr: number) {
    this.loadFibers()
  }

  private async loadFibers() {
    if (!this.fiberAddr || this.fiberAddr === 0) {
      this.$message.error('fiberAddr required.')
      return
    }
    if (this.devId < 1 || !this.devId) {
      this.$message.error('devId required.')
      return
    }
    this.lloading = true
    try {
      let { data } = await scanFiberOnuList(this.devId, this.fiberAddr)
      this.onuList = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.lloading = false
    }
  }

  created() {
    this.loadFibers()
  }

  private onuRowColor(r: ITableRowClassName) {
    switch (r.row.onu_state) {
      case 'ok':
        return ''
      case 'down':
        return 'error-row'
    }
    return 'warning-row'
  }
}
</script>
