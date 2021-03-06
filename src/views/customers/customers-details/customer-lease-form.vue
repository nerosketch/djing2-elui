<template lang="pug">
  el-form(
    ref='frm'
    v-loading='frmLoading'
    :label-width="$store.getters.isMobileView ? undefined : '100px'"
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
      el-select(
        v-model="frmMod.pool"
        v-loading="poolsLoading"
        :disabled="pools.length === 0"
      )
        template(v-if="pools.length > 0")
          el-option(
            v-for="p in pools"
            :key="p.id"
            :label="`${p.network} - ${p.description}`"
            :value="p.id"
          )
        el-option(
          v-else
          label="Нет пулов"
          :value="null"
        )
    el-form-item(
      label="MAC Адрес"
      prop='mac_address'
    )
      el-input(v-model="frmMod.mac_address")
    el-form-item(
      label="dhcp"
      prop='is_dynamic'
    )
      el-checkbox(v-model='frmMod.is_dynamic')
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary"
        @click="onSubmit"
        :loading="frmLoading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { AppModule } from '@/store/modules/app'
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
  private frmLoading = false
  private getFreeIpLoad = false
  private pools: INetworkIpPool[] = []
  private poolsLoading = false

  @Prop({ required: true })
  private isAddNewLease!: boolean

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

  private onSubmit() {
    (this.$refs['frm'] as Form).validate(async valid => {
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
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private async getFreeIp() {
    this.getFreeIpLoad = true
    NetworkIpPoolModule.SET_ID(this.frmMod.pool)
    try {
      const ip = await NetworkIpPoolModule.GetFreeIP()
      if (ip) {
        this.frmMod.ip_address = ip
      } else {
        this.$message.error('Не получилось подобрать ip :(')
      }
    } catch (err) {
      this.$message.error(err)
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
      pool: 0,
      customer: CustomerModule.pk,
      mac_address: '',
      is_dynamic: false
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
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.poolsLoading = false
    }
  }
}
</script>
