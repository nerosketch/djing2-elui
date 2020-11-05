<template lang="pug">
  el-form(
    ref='leasefrm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label='IP Адрес'
      prop='ip_address'
    )
      el-input(v-model="frmMod.ip_address")
    el-form-item(
      label='MAC Адрес'
      prop='mac_address'
    )
      el-input(v-model="frmMod.mac_address")
    el-form-item(
      label='Динамический'
      prop='is_dynamic'
    )
      el-checkbox(v-model="frmMod.is_dynamic") {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}
    el-form-item
      el-button(type='primary' @click="onSubmit" :loading="isLoading") Сохранить
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
      { required: true, message: 'IP не может быть пустым', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    mac_address: [
      { required: true, message: 'MAC не нужно оставлять пустым', trigger: 'blur' },
      { validator: macAddrValidator, trigger: 'change', message: 'Пример mac: 0a:0b:cc:dd::ee:ff' }
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

  get leaseId() {
    return CustomerIpLeaseModule.id
  }
  @Watch('leaseId')
  private async onNetwCh() {
    this.frmMod = await CustomerIpLeaseModule.GetAllLeaseState()
  }

  private onSubmit() {
    (this.$refs['leasefrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        await CustomerIpLeaseModule.SET_ALL_LEASE(this.frmMod)
        const newDat = await CustomerIpLeaseModule.SaveLease()
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
