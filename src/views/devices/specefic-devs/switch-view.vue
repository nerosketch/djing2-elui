<template lang="pug">
  el-card.box-card
    template(v-slot:header)
      .clearfix
        span {{ device.comment || 'Коммутатор' }} &nbsp;
        small {{ `${device.ip_address || device.mac_addr}` }}
    el-table(
      :data="allPorts"
      :loading="loading"
      :row-class-name="tableRowClassName"
      border fit size='small'
    )
      el-table-column(
        label="Порт"
        width="60"
        align='center'
      )
        template(v-slot:default="{row}") {{ row.num }}
      el-table-column(
        label="Описание"
      )
        template(v-slot:default="{row}") {{ row.descr }}
      el-table-column(
        label="Абонов"
        width="70"
        align='center'
      )
        template(v-slot:default="{row}") {{ row.user_count }}
      el-table-column(
        label="Имя"
      )
        template(v-slot:default="{row}") {{ row.name || '-' }}
      el-table-column(
        label="MAC"
      )
        template(v-slot:default="{row}") {{ row.mac_addr || '-' }}
      el-table-column(
        label="Режим"
      )
        template(v-slot:default="{row}") {{ row.speed ? portModesHuman(row.speed) : '-' }}
      el-table-column(
        label="UpTime"
      )
        template(v-slot:default="{row}") {{ row.uptime || '-' }}
      el-table-column(
        label="Кнопки"
        align='center'
      )
        template(v-slot:default="{row}")
          el-button-group(v-if="row.isdb")
            el-button(size='mini' icon='el-icon-view' @click="openPortView(row)")
            el-button(size='mini' type='danger' icon='el-icon-delete')
            el-button(size='mini' type='primary' icon='el-icon-edit')
          el-button(v-else size='mini' icon='el-icon-plus' circle)
    el-dialog(
      :visible.sync="portViewDialog"
      title="Абоненты на порту"
    )
      switch-port-view(
        :device="device"
        :portId="currPortId"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice, IPort } from '@/api/devices/types'
import { DeviceModule } from '@/store/modules/devices/device'
import PonBdcomOlt from './pon-bdcom-olt.vue'
import { getPorts, scanPorts } from '@/api/devices/req'
import SwitchPortView from './switch-port-view.vue'

interface IFinPort {
  pk?: number
  num: number
  descr?: string
  user_count?: number
  snmp_number?: number
  name?: string
  status?: boolean
  mac_addr?: string
  speed?: number
  uptime?: string
  isdb: boolean
}

interface IPortDict {
  [key: number]: string
}

const PortModes: IPortDict = {
  10000000: '10 mbps',
  100000000: '100 Mbps',
  1000000000: '1 Gbps',
  10000000000: '10 Gpbs'
}

interface ITableRowClassName {
  row: IFinPort
  rowIndex: number
}

@Component({
  name: 'SwitchView',
  components: {
    PonBdcomOlt,
    SwitchPortView
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null

  private allPorts: IFinPort[] = []
  private loading = false
  private portViewDialog = false
  private currPortId = 0

  private async loadPorts() {
    if (this.device !== null) {
      const { data } = await getPorts(this.device.pk)
      for (const p of data.results) {
        this.allPorts.push({
          pk: p.pk,
          num: p.num,
          descr: p.descr,
          user_count: p.user_count,
          isdb: true
        } as IFinPort)
      }
    }
  }

  private async scanPorts() {
    if (this.device !== null) {
      const { data } = await scanPorts(this.device.pk)
      for (const p of data) {
        const pInd = this.allPorts.findIndex(fport => fport.num === p.num)
        if (pInd > -1) {
          this.allPorts[pInd].num = p.num
          this.allPorts[pInd].snmp_number = p.snmp_number
          this.allPorts[pInd].name = p.name
          this.allPorts[pInd].status = p.status
          this.allPorts[pInd].mac_addr = p.mac_addr
          this.allPorts[pInd].speed = p.speed
          this.allPorts[pInd].uptime = p.uptime
        } else {
          this.allPorts.push({
            num: p.num,
            snmp_number: p.snmp_number,
            name: p.name,
            status: p.status,
            mac_addr: p.mac_addr,
            speed: p.speed,
            uptime: p.uptime,
            isdb: false
          } as IFinPort)
        }
      }
    }
  }

  private loadAll() {
    this.loading = true
    this.loadPorts().then(() => {
      this.scanPorts().finally(() => {
        this.loading = false
        this.allPorts.sort((a, b) => (a.num - b.num))
      })
    })
  }

  public portModesHuman(speed: number): string {
    return PortModes[speed]
  }

  created() {
    this.loadAll()
  }

  tableRowClassName(info: ITableRowClassName) {
    if (info.row.speed === undefined) {
      return ''
    }
    const rowCNames: IPortDict = {
      10000000: 'port-kilo',
      100000000: 'port-mega',
      1000000000: 'port-giga',
      10000000000: 'port-ten'
    }
    return rowCNames[info.row.speed]
  }

  private openPortView(port: IPort) {
    this.currPortId = port.pk
    this.portViewDialog = true
  }
}
</script>

<style lang="scss">
.el-table {
  .port-kilo {
    background-color: #fbe8c4;
  }
  .port-mega {
    background-color: #cafbca;
  }
  .port-giga {
    background-color: #eaebff;
  }
  .port-ten {
    background-color: #abf9f2;
  }
}
</style>
