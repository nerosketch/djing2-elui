<template lang="pug">
  el-card.box-card
    template(v-slot:header)
      .clearfix
        span {{ device.comment || 'Коммутатор' }} 
        small {{ ` ${device.ip_address || device.mac_addr}` }}
        el-button(
          style="float: right; padding: 7px" circle size='mini' icon='el-icon-edit' type='primary'
          @click="openDevForm"
          :disabled="!$perms.devices.change_device"
        )
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
        template(v-slot:default="{row}")
          b {{ row.num }}
      el-table-column(
        label="Вкл/Выкл"
        width="80"
        align="center"
      )
        template(v-slot:default="{row}")
          switch-port-toggle-button(
            v-if="row.isdb && row.snmp_number > 0"
            :port="row"
            :portId="row.pk"
          )
          el-button(v-else size='mini' icon='el-icon-close' circle disabled)
      el-table-column(
        label="Описание"
        min-width='267'
      )
        template(v-slot:default="{row}") {{ row.descr }}
      el-table-column(
        label="Абонов"
        width="70"
        align='center'
      )
        template(v-slot:default="{row}")
          el-link(type="primary" @click="openPortView(row)") {{ row.user_count }}
      el-table-column(
        label="Имя"
        min-width='235'
      )
        template(v-slot:default="{row}") {{ row.name || '-' }}
      el-table-column(
        label="Режим"
        min-width='78'
      )
        template(v-slot:default="{row}") {{ row.speed ? portModesHuman(row.speed) : '-' }}
      el-table-column(
        label="UpTime"
        min-width='176'
      )
        template(v-slot:default="{row}") {{ row.uptime || '-' }}
      el-table-column(
        label="Кнопки"
        align='center'
        min-width='194'
      )
        template(v-slot:default="{row}")
          el-button-group(v-if="row.isdb")
            el-button(size='mini' icon='el-icon-notebook-2' @click="openMacsDialog(row)")
            el-button(size='mini' icon='el-icon-view' @click="openVidsDialog(row)" :disabled="!$perms.devices.view_portvlanmembermodel")
            el-button(size='mini' type='danger' icon='el-icon-delete' @click="delPort(row)" :disabled="!$perms.devices.delete_port")
            el-button(size='mini' type='primary' icon='el-icon-edit' @click="openPortEdit(row)" :disabled="!$perms.devices.change_port")
          el-button(
            v-else size='mini' icon='el-icon-plus' circle
            @click="openPortAdd(row)"
            :disabled="!$perms.devices.add_port"
          )
    el-dialog(
      :visible.sync="portViewDialog"
      title="Абоненты на порту"
    )
      switch-port-view(
        :device="device"
        :portId="currPortId"
      )
    el-dialog(
      :visible.sync="portFormDialog"
      title="Порт коммутатора"
    )
      switch-port-form(
        :deviceId="device.pk"
        :portId="currPortId"
        :initialNum="initialNum"
        v-on:editdone="editPortDone"
        v-on:adddone="addPortDone"
      )
    el-dialog(
      :visible.sync="devFormDialog"
      title="Порт коммутатора"
    )
      dev-form(
        v-on:done="devFrmDone"
      )
    el-dialog(
      :visible.sync="vidsDialog"
      title="Vlan'ы"
    )
      vids-view(
        :portId="currPortId"
      )
    el-dialog(
      :visible.sync="macsDialog"
      title="ARP таблица для порта"
    )
      port-mac-list(
        :portId="currPortId"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IDevice, IPort, IScannedPort } from '@/api/devices/types'
import { PortModule } from '@/store/modules/devices/port'
import PonBdcomOlt from './pon-bdcom-olt.vue'
import { getPorts, scanPorts } from '@/api/devices/req'
import SwitchPortView from './switch/switch-port-view.vue'
import SwitchPortForm from './switch/switch-port-form.vue'
import SwitchPortToggleButton from './switch/switch-port-toggle-button.vue'
import DevForm from '../dev-form.vue'
import VidsView from './switch/vlan/vids-view.vue'
import PortMacList from './switch/port-mac-list.vue'

interface IFinPort {
  pk?: number
  num: number
  descr?: string
  user_count?: number
  snmp_number?: number
  name?: string
  status?: boolean
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
    SwitchPortView,
    SwitchPortForm,
    SwitchPortToggleButton,
    DevForm,
    VidsView,
    PortMacList
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null

  private allPorts: IFinPort[] = []
  private loading = false
  private portViewDialog = false
  private portFormDialog = false
  private currPortId = 0
  private initialNum = 0
  private devFormDialog = false
  private vidsDialog = false
  private macsDialog = false

  private async loadPorts() {
    if (this.device !== null) {
      try {
        const { data } = await getPorts(this.device.pk)
        this.allPorts = data.map(p => ({
            pk: p.pk,
            num: p.num,
            descr: p.descr,
            user_count: p.user_count,
            isdb: true
          }))
      } catch (err) {
        this.$message.error(err)
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
          this.allPorts[pInd].speed = p.speed
          this.allPorts[pInd].uptime = p.uptime
        } else {
          this.allPorts.push({
            num: p.num,
            snmp_number: p.snmp_number,
            name: p.name,
            status: p.status,
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

  private delPort(port: IPort) {
    this.$confirm(`Удалить порт "${port.descr}"?`).then(async() => {
      await PortModule.DelPort(port.pk)
      const ind = this.allPorts.findIndex(el => el.pk === port.pk)
      if (ind > -1) {
        delete this.allPorts[ind].pk
        delete this.allPorts[ind].descr
        delete this.allPorts[ind].user_count
        this.allPorts[ind].isdb = false
      }
      this.$message.success('Порт успешно удалён')
    })
  }

  private openPortEdit(port: IPort) {
    this.currPortId = port.pk
    this.portFormDialog = true
  }

  private openPortAdd(port: IScannedPort) {
    this.currPortId = 0
    this.initialNum = port.num
    this.portFormDialog = true
  }

  private editPortDone(port: IPort) {
    this.addEditPortDone(port, false)
  }
  private addPortDone(port: IPort) {
    this.addEditPortDone(port, true)
  }
  private addEditPortDone(port: IPort, isAdd: boolean) {
    this.portFormDialog = false
    const ind = this.allPorts.findIndex(el => el.num === port.num)
    if (ind > -1) {
      this.allPorts[ind].pk = port.pk
      this.allPorts[ind].descr = port.descr
      this.allPorts[ind].isdb = true
    }
    if (isAdd) {
      this.$message.success('Порт успешно сохранён')
    } else {
      this.$message.success('Порт успешно изменён')
    }
  }

  private openDevForm() {
    this.devFormDialog = true
  }

  private devFrmDone(device: IDevice) {
    this.devFormDialog = false
    this.$message.success('Успешно сохранено')
    this.$router.push({ name: 'devicesList', params: { groupId: device.group.toString() } })
  }

  private openVidsDialog(port: IPort) {
    this.currPortId = port.pk
    this.vidsDialog = true
  }

  private openMacsDialog(port: IPort) {
    this.currPortId = port.pk
    this.macsDialog = true
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
