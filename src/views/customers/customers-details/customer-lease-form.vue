<template lang="pug">
  el-form(
    ref="frm"
    v-loading="frmLoading"
    :label-width="$store.getters.isMobileView ? undefined : '100px'"
    status-icon
    :rules="frmRules"
    :model="frmMod")
    el-form-item(:label="$t('ipAddress')" prop="ip_address")
      el-input(v-model="frmMod.ip_address")
        template(v-slot:append)
          el-button(
            icon="el-icon-refresh"
            @click="getFreeIp"
            :loading="getFreeIpLoad"
            :disabled="!frmMod.pool")

    el-form-item(:label="$t('customers.ipPool')" prop="pool")
      el-select(
        v-model="frmMod.pool"
        v-loading="poolsLoading"
        :disabled="pools.length === 0")
        template(v-if="pools.length > 0")
          el-option(
            v-for="p in pools"
            :key="p.id"
            :label="`${p.network} - ${p.description}`"
            :value="p.id")

        el-option(
          v-else
          :label="$t('customers.poolsNotExists')"
          :value="null")

    el-form-item(:label="$t('macAddress')" prop="mac_address")
      el-input(v-model="frmMod.mac_address")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="frmLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import { CustomerModule } from '@/store/modules/customers/customer'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'
import { getNetworkIpPools } from '@/api/networks/req'
import {
  ICustomerIpLease, INetworkIpPool
} from '@/api/networks/types'

@Component({
  name: 'CustomerLeaseForm'
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private frmLoading = false
  private getFreeIpLoad = false
  private pools: INetworkIpPool[] = []
  private poolsLoading = false

  @Prop({ required: true })
  private isAddNewLease!: boolean

  private frmRules = {
    ip_address: [
      { required: true, message: this.$tc('nets.ipMustNotBeEmpty').toString(), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$tc('customers.badIp') }
    ],
    mac_address: [
      { validator: macAddrValidator, trigger: 'change', message: this.$tc('customers.badMac') }
    ],
    pool: [
      { required: true, message: this.$tc('nets.poolRequiredMsg').toString(), trigger: 'blur' },
    ]
  }

  private frmMod: {
    ip_address: string,
    pool: number | null,
    customer: number,
    mac_address: string
  } = {
    ip_address: '',
    pool: null,
    customer: 0,
    mac_address: ''
  }

  @Watch('frmMod', { deep: true })
  private onChFrmMod() {
    this.$refs.frm.validate()
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.frmLoading = true
        try {
          if (this.isAddNewLease) {
            await CustomerIpLeaseModule.AddLease(this.frmMod)
          } else {
            await CustomerIpLeaseModule.PatchLease(this.frmMod)
          }
          this.$emit('done')
        } catch (err) {
          return false
        } finally {
          this.frmLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs').toString())
      }
    })
  }

  private async getFreeIp() {
    if(!this.frmMod.pool) return
    this.getFreeIpLoad = true
    NetworkIpPoolModule.SET_ID(this.frmMod.pool)
    try {
      const ip = await NetworkIpPoolModule.GetFreeIP()
      if (ip) {
        this.frmMod.ip_address = ip
      } else {
        this.$message.error(
          this.$tc('customers.failedGettingFreeIp').toString()
        )
      }
    } finally {
      this.getFreeIpLoad = false
    }
  }

  public editLease(lease: ICustomerIpLease) {
    CustomerIpLeaseModule.SET_ALL_LEASE(lease)
    if (this.pools.length === 0) {
      this.loadPools()
    }
    this.frmMod = lease
  }

  public async addLease() {
    this.frmMod = {
      ip_address: '',
      pool: null,
      customer: CustomerModule.id,
      mac_address: ''
    }
    if (this.pools.length === 0) {
      this.loadPools()
    }
  }

  private async loadPools() {
    this.poolsLoading = true
    try {
      const { data } = await getNetworkIpPools({
        groups: CustomerModule.group
      }) as any
      this.pools = data
    } finally {
      this.poolsLoading = false
    }
  }

  mounted() {
    this.$refs.frm.validate()
  }
}
</script>
