<template lang="pug">
  el-card(shadow="never")
    .clearfix(slot='header')
      span Сетевое
    el-table(
      v-loading='loading'
      :data="leases"
      border fit size='small'
    )
      el-table-column(
        label="IP Адрес"
      )
        template(slot-scope="{row}") {{ row.ip_address }}
      el-table-column(
        label="MAC Адрес"
      )
        template(slot-scope="{row}") {{ row.mac_address }}
      el-table-column(
        label="Время аренды"
      )
        template(slot-scope="{row}") {{ row.lease_time }}
      el-table-column(
        label="Дин."
        align="center"
        width="50"
      )
        el-checkbox(slot-scope="{row}" v-model="row.is_dynamic" disabled)
      el-table-column(
        label="#"
        align="center"
        width="120"
      )
        el-button-group(slot-scope="{row}")
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
        status-icon
        :rules='frmRules'
        :model='frmMod'
      )
        el-form-item(
          label="IP Адрес"
          prop='ip_address'
        )
          el-input(v-model="frmMod.ip_address")
            el-button(
              slot='append' icon='el-icon-refresh'
              @click="getFreeIp" :loading='getFreeIpLoad'
              :disabled="frmMod.pool === 0"
            )
        el-form-item(
          label="IP Pool"
          prop='pool'
        )
          el-select(v-model="frmMod.pool")
            el-option(
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
import { CustomerModule } from '@/store/modules/customers/customer'
import { ICustomerIpLease, INetworkIpPool } from '@/api/networks/types'
import { getCustomerIpLeases, getNetworkIpPools } from '@/api/networks/req'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'

@Component({
  name: 'Network'
})
export default class extends Vue {
  private leases: ICustomerIpLease[] = []
  private pools: INetworkIpPool[] = []
  private loading = false
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

  private async loadLeases() {
    this.loading = true
    const { data } = await getCustomerIpLeases(undefined, CustomerModule.pk)
    this.leases = data.results
    this.loading = false
  }

  private async loadPools() {
    this.loading = true
    const { data } = await getNetworkIpPools()
    this.pools = data.results
    this.loading = false
  }

  async created() {
    await this.loadLeases()
    await this.loadPools()
  }

  private editLease(lease: ICustomerIpLease) {
    this.frmMod = lease
    this.isAddNewLease = false
    this.editDialog = true
  }

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
      if (valid) {
        this.frmLoading = true
        if(this.isAddNewLease) {
          await CustomerIpLeaseModule.AddLease(<ICustomerIpLease>this.frmMod)
        } else {
          await CustomerIpLeaseModule.PatchLease(this.frmMod)
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
    }).then(() => {
      CustomerIpLeaseModule.DelLease(lease.id)
      this.loadLeases()
      this.$message.success('Аренда удалена')
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
