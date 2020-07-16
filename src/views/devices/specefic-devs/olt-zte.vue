<template lang="pug">
  el-card.box-card
    template(v-slot:header)
      .clearfix
        span zte
        small sdg
        el-button(style="float: right; padding: 7px" circle size='mini' icon='el-icon-edit' type='primary' @click="openDevForm")
    el-row
      el-col(:span="2" v-for="(p, i) in allPorts" :key="i")
        olt-zte-port(:port="p")
    el-divider
    h4 Незарегистрированные юниты
    el-table(
      :data="unregistered"
      :loading="unrloading"
      v-if="device !== null"
      border fit size='small'
    )
      el-table-column(
        label="Мак"
      )
        template(v-slot:default="{row}") {{ row.mac }}
      el-table-column(
        label="Версия прошивки"
      )
        template(v-slot:default="{row}") {{ row.firmware_ver }}
      el-table-column(
        label="LOID пароль"
      )
        template(v-slot:default="{row}") {{ row.loid_passw }}
      el-table-column(
        label="LOID"
      )
        template(v-slot:default="{row}") {{ row.loid }}
      el-table-column(
        label="sn"
      )
        template(v-slot:default="{row}") {{ row.sn }}

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import OltZtePort from './olt-zte-port.vue'
import { scanOltFibers, scanUnitsUnregistered } from '@/api/devices/req'
import { IDevice, IDevFiber, IUnitUnregistered } from '@/api/devices/types'

@Component({
  name: 'OltZte',
  components: {
    OltZtePort
  }
})
export default class extends Vue {
  @Prop({ default: null }) private device!: IDevice | null
  private devFormDialog = false
  private loading = false
  private unrloading = false
  private allPorts: IDevFiber[] = []
  private unregistered: IUnitUnregistered[] = []

  private openDevForm() {
    this.devFormDialog = true
  }

  private async loadFibers() {
    if (this.device !== null) {
      this.loading = true
      const { data } = await scanOltFibers(this.device.pk)
      this.allPorts = data
      this.loading = false
    }
  }

  private async loadUnregistered() {
    if (this.device !== null) {
      this.unrloading = true
      const { data } = await scanUnitsUnregistered(this.device.pk)
      this.unregistered = data
      this.unrloading = false
    }
  }

  created() {
    this.loadFibers()
    this.loadUnregistered()
  }
}
</script>
