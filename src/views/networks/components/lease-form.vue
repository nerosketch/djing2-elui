<template lang="pug">
  el-form(
    ref="leasefrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(label="$t('ip-adres-1')", prop="ip_address")
      el-input(v-model="frmMod.ip_address")
  
    el-form-item(label="$t('mac-adres-0')", prop="mac_address")
      el-input(v-model="frmMod.mac_address")
  
    el-form-item(label="$t('dinamicheskii')", prop="is_dynamic")
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
import { ICustomerIpLease } from '@/api/networks/types'
import { CustomerIpLeaseModule } from '@/store/modules/networks/ip_lease'

@Component({
  name: 'lease-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    ip_address: [
      { required: true, message: this.$t('nets.ipMustNotBeEmpty').toString(), trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: this.$t('primer-ip-192-168-0-23-1') }
    ],
    mac_address: [
      { required: true, message: this.$t('mac-ne-nuzhno-ostavlyat-pustym'), trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: this.$t('primer-mac-0a-0b-cc-dd-ee-ff-1') }
    ]
  }

  private frmMod: ICustomerIpLease = {
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
    this.frmMod = await CustomerIpLeaseModule.GetAllLeaseState()
  }

  private onSubmit() {
    (this.$refs.leasefrm as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          await CustomerIpLeaseModule.SET_ALL_LEASE(this.frmMod)
          const newDat = await CustomerIpLeaseModule.SaveLease()
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
