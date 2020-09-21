<template lang="pug">
  el-card(shadow="never")
    template(v-slot:header)
      .clearfix Сетевое
    el-table(
      v-loading='loading'
      :data="leases"
      border fit size='small'
    )
      el-table-column(
        label="IP Адрес"
        min-width='110'
      )
        template(v-slot:default="{row}") {{ row.ip_address }}
      el-table-column(
        label="MAC Адрес"
        min-width='110'
      )
        template(v-slot:default="{row}") {{ row.mac_address }}
      el-table-column(
        label="Время аренды"
        min-width='110'
      )
        template(v-slot:default="{row}") {{ row.lease_time }}
      el-table-column(
        label="Дин."
        align="center"
        width="50"
      )
        template(v-slot:default="{row}")
          el-checkbox(v-model="row.is_dynamic" disabled)
      el-table-column(
        label="Ping"
        align="center"
        min-width='100'
      )
        template(v-slot:default="{row}")
          lease-ping(:lease="row")
      el-table-column(
        label="#"
        align="center"
        width="120"
      )
        template(v-slot:default="{row}")
          el-button-group
            el-button(
              type='primary' size='mini'
              icon='el-icon-edit'
              @click="editLease(row)"
              :disabled="row.is_dynamic"
            )
            el-button(
              type='danger' size='mini'
              icon='el-icon-delete'
              @click="delLease(row)"
            )
    el-button(size='small' type='success' icon='el-icon-plus', @click="addLease") Добавить

    el-dialog(
      :title="(isAddNewLease ? 'Добавить' : 'Изменить') + ' аренду ip'"
      :visible.sync='editDialog'
    )
      el-form(
        ref='frm'
        v-loading='frmLoading'
        :label-width="isMobileView ? undefined : '100px'"
        size="mini"
        status-icon
        :rules='frmRules'
        :model='frmMod'
      )
        el-form-item(
          label="IP Адрес"
          prop='ip_address'
        )
          el-input(v-model="frmMod.ip_address")
            template(v-slot:append)
              el-button(
                icon='el-icon-refresh'
                @click="getFreeIp" :loading='getFreeIpLoad'
                :disabled="frmMod.pool === 0"
              )
        el-form-item(
          label="IP Pool"
          prop='pool'
        )
          el-select(v-model="frmMod.pool" v-loading="poolsLoading")
            el-option(
              v-if="pools.length > 0"
              v-for="p in pools"
              :key="p.id"
              :label="`${p.network} - ${p.description}`"
              :value="p.id"
            )
        el-form-item(
          label="MAC Адрес"
          prop='mac_address'
        )
          el-input(v-model="frmMod.mac_address")
        el-form-item
          el-button(type="primary" @click="onSubmit" :loading="frmLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { AppModule } from '@/store/modules/app'
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerIpLease, INetworkIpPool } from '@/api/networks/types'
import { getCustomerIpLeases, getNetworkIpPools } from '@/api/networks/req'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import LeasePing from '@/components/MyButtons/leaseping.vue'

@Component({
  name: 'Network',
  components: {
    LeasePing
  }
})
export default class extends Vue {
  private leases: ICustomerIpLease[] = []
  private pools: INetworkIpPool[] = []
  private loading = false
  private poolsLoading = false
  private editDialog = false
  private frmLoading = false
  private getFreeIpLoad = false
  private isAddNewLease = false

  private frmRules = {
    ip_address: [
      { required: true, message: 'IP не может быть пустым', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Не правильный ip' }
    ],
    mac_address: [
      { validator: macAddrValidator, trigger: 'change', message: 'Не правильный mac' }
    ]
  }

  private frmMod = {
    ip_address: '',
    pool: 0,
    customer: 0,
    mac_address: '',
    is_dynamic: false
  }

  private get isMobileView() {
    return AppModule.IsMobileDevice
  }

  private async loadLeases() {
    this.loading = true
    const { data } = await getCustomerIpLeases(undefined, CustomerModule.pk)
    this.leases = data.results
    this.loading = false
  }

  private async loadPools() {
    this.poolsLoading = true
    const { data } = await getNetworkIpPools({
      groups: CustomerModule.group
    })
    this.pools = data.results
    this.poolsLoading = false
  }

  async created() {
    await this.loadLeases()
  }

  private editLease(lease: ICustomerIpLease) {
    CustomerIpLeaseModule.SET_ALL_LEASE(lease)
    this.frmMod = lease
    this.isAddNewLease = false
    this.editDialog = true
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.frmLoading = true
        try {
          if(this.isAddNewLease) {
            await CustomerIpLeaseModule.AddLease(this.frmMod)
          } else {
            await CustomerIpLeaseModule.PatchLease(this.frmMod)
          }
          this.loadLeases()
        } catch (err) {
          this.$message.error(err)
        }
        this.frmLoading = false
        this.editDialog = false
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private delLease(lease: ICustomerIpLease) {
    this.$confirm('Удалить аренду ip? Абонент больше не сможет получать услугу через этот ip.', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Нет'
    }).then(async() => {
      await CustomerIpLeaseModule.DelLease(lease.id)
      this.$message.success('Аренда удалена')
      this.loadLeases()
    })
  }

  private async addLease() {
    this.frmMod = {
      ip_address: '',
      pool: 0,
      customer: CustomerModule.pk,
      mac_address: '',
      is_dynamic: false
    }
    this.loadPools()
    this.isAddNewLease = true
    this.editDialog = true
  }

  private async getFreeIp() {
    this.getFreeIpLoad = true
    await NetworkIpPoolModule.SET_ID(this.frmMod.pool)
    const ip = await NetworkIpPoolModule.GetFreeIP()
    if(ip) {
      this.frmMod.ip_address = ip
    } else {
      this.$message.error('Не получилось подобрать ip :(')
    }
    this.getFreeIpLoad = false
  }
}
</script>
