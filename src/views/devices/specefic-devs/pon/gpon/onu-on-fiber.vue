<template>  <span>
    <el-table :data="onuList" v-loading="lloading" :row-class-name="onuRowColor" border fit>
      <el-table-column label="$t('tip-0')" min-width="80" prop="onu_type"></el-table-column>
      <el-table-column label="$t('port')" min-width="90" prop="onu_port"></el-table-column>
      <el-table-column label="$t('seriinik')" min-width="90" prop="onu_sn"></el-table-column>
    </el-table></span>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { IScannedZTEONU } from '@/api/devices/types'
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
  private onChFibAddr() {
    this.loadFibers()
  }

  private async loadFibers() {
    if (!this.fiberAddr || this.fiberAddr === 0) {
      this.$message.error(this.$t('fiberaddr-required'))
      return
    }
    if (this.devId < 1 || !this.devId) {
      this.$message.error(this.$t('devid-required'))
      return
    }
    this.lloading = true
    try {
      const { data } = await scanFiberOnuList(this.devId, this.fiberAddr)
      this.onuList = data
    } finally {
      this.lloading = false
    }
  }

  created() {
    this.loadFibers()
  }

  private onuRowColor({ row }: ITableRowClassName) {
    switch (row.onu_state) {
      case 'ok':
        return ''
      case 'down':
        return 'error-row'
    }
    return 'warning-row'
  }
}
</script>
