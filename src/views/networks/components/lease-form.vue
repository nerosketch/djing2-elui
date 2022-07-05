<template lang="pug">
  el-form(
    ref="leasefrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(
      :label="$t('ipAddress')"
      prop="ip_address"
    )
      el-input(v-model="frmMod.ip_address")

    el-form-item(
      :label="$t('macAddress')"
      prop="mac_address"
    )
      el-input(v-model="frmMod.mac_address")

    el-form-item(
      :label="$t('dynamic')"
      prop="is_dynamic"
    )
      el-checkbox(v-model="frmMod.is_dynamic")
        | {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, macAddrValidator } from '@/utils/validate'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'

@Component({
  name: 'lease-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    ip_address: [
      { required: true, message: this.$tc('nets.ipMustNotBeEmpty'), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$tc('example192168023') }
    ],
    mac_address: [
      { required: true, message: this.$tc('weDonTHaveToLeaveTheMobEmpty'), trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: this.$tc('exampleMac') }
    ]
  }

  private frmMod = {
    id: CustomerIpLeaseModule.id,
    ip_address: CustomerIpLeaseModule.ip_address,
    pool: CustomerIpLeaseModule.pool,
    customer: CustomerIpLeaseModule.customer,
    lease_time: CustomerIpLeaseModule.lease_time,
    last_update: CustomerIpLeaseModule.last_update,
    mac_address: CustomerIpLeaseModule.mac_address,
    is_dynamic: CustomerIpLeaseModule.is_dynamic
  }

  @Watch('$store.state.iplease.id')
  private async onNetwCh() {
    const s = CustomerIpLeaseModule
    this.frmMod.id = s.id
    this.frmMod.ip_address = s.ip_address
    this.frmMod.pool = s.pool
    this.frmMod.customer = s.customer
    this.frmMod.lease_time = s.lease_time
    this.frmMod.last_update = s.last_update
    this.frmMod.mac_address = s.mac_address
    this.frmMod.is_dynamic = s.is_dynamic
  }

  private onSubmit() {
    (this.$refs.leasefrm as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          const newDat = await CustomerIpLeaseModule.PatchLease(this.frmMod)
          this.$emit('done', newDat)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }
}
</script>
