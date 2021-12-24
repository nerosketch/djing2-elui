<template>  
  <el-card>
    <template v-slot:header>
      <div class="clearfix"><span>zte -</span><small>{{ ` ${device.ip_address || device.mac_addr} ` }}</small><small>{{ details }}</small>
        <el-button style="float: right; padding: 7px" circle icon="el-icon-edit" type="primary" @click="openDevForm" :disabled="!$perms.devices.change_device"></el-button>
      </div>
    </template>
    <el-row>
      <el-col :xl="2" :md="3" :sm="6" :xs="12" v-for="(p, i) in allPorts" :key="i">
        <olt-zte-port :devId="devPk" :port="p"></olt-zte-port>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h4>Незарегистрированные юниты</h4>
    <el-table :data="unregistered" :loading="unrloading" v-if="device !== null" border fit>
      <el-table-column label="Мак" min-width="150" prop="mac"></el-table-column>
      <el-table-column label="Версия прошивки" min-width="150" prop="firmware_ver"></el-table-column>
      <el-table-column label="LOID пароль" min-width="100" prop="loid_passw"></el-table-column>
      <el-table-column label="LOID" min-width="150" prop="loid"></el-table-column>
      <el-table-column label="sn" min-width="150" prop="sn"></el-table-column>
      <el-table-column label="Сохранить" min-width="70">
        <template v-slot:default="{row}">
          <el-button icon="el-icon-plus" @click="onSaveOnu(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Сохранить ONU" :visible.sync="saveOnuFormDialog" :close-on-click-modal="false">
      <new-dev-form :initialMac="newOnuInitialMac" :initialDevType="gdevType" :initialGroup="device.group" :initialParentDev="devPk" :initialParentDevName="device.comment" v-if="saveOnuFormDialog" v-on:done="frmNewOnuDone" v-on:err="saveOnuFormDialog=false"></new-dev-form>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { scanOltFibers, scanUnitsUnregistered, scanPonDetails } from '@/api/devices/req'
import { IDevice, IDevFiber, IUnitUnregistered, IDeviceTypeEnum } from '@/api/devices/types'
import OltZtePort from './olt-zte-port.vue'
import NewDevForm from '@/views/devices/new-dev-form.vue'

@Component({
  name: 'OltZte',
  components: {
    OltZtePort,
    NewDevForm
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private devFormDialog = false
  private loading = false
  private unrloading = false
  private allPorts: IDevFiber[] = []
  private unregistered: IUnitUnregistered[] = []
  private saveOnuFormDialog = false
  private newOnuInitialMac = ''
  private details = ''

  private openDevForm() {
    this.devFormDialog = true
  }

  private get gdevType() {
    return IDeviceTypeEnum.OnuZTE_F660
  }

  private async loadFibers() {
    if (this.device !== null) {
      this.loading = true
      try {
        const { data } = await scanOltFibers(this.devPk)
        this.allPorts = data
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.loading = false
      }
    }
  }

  private async loadUnregistered() {
    if (this.device !== null) {
      this.unrloading = true
      try {
        const { data } = await scanUnitsUnregistered(this.devPk)
        this.unregistered = data
      } catch (err) {
        this.$message.error(err)
      } finally {
        this.unrloading = false
      }
    }
  }

  created() {
    this.loadFibers()
    this.loadUnregistered()
    this.scanZteDetails()
  }

  get devPk() {
    if (this.device) {
      return this.device.id
    }
    return 0
  }

  @Watch('devPk')
  private onChDev() {
    this.scanZteDetails()
  }

  private onSaveOnu(onu: IUnitUnregistered) {
    this.newOnuInitialMac = onu.mac
    this.saveOnuFormDialog = true
  }

  private frmNewOnuDone(newDev: IDevice) {
    this.saveOnuFormDialog = false
    this.$message.success('Новая onu сохранена')
    this.$router.push({ name: 'device-view', params: { devId: newDev.id.toString() } })
  }

  private async scanZteDetails() {
    if (this.device) {
      const { data } = await scanPonDetails(this.devPk)
      this.details = `Имя ${data.name}. В сети ${data.uptime}. Версия прошивки ${data.fver}.`
    }
  }
}
</script>
