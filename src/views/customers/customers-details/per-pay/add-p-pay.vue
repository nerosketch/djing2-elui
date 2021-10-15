<template lang="pug">
  el-form(
    v-loading='loading'
  )
    el-form-item(
      label="Периодический платёж"
    )
      el-select(v-model="pserviceId")
        el-option(
          v-for="srv in pservices"
          :key="srv.id"
          :label="srv.name"
          :value="srv.id"
        )
    el-form-item(
      label="Дата следующего платежа"
    )
      el-date-picker(
        v-model="deadline"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        format="d.MM.yyyy HH:mm"
      )
    el-form-item
      el-button(
        type="success" @click="onSubmit"
        :loading="loading"
        :disabled="addDisabledGetter"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CurrentPermissions } from '@/store/current-user-permissions'
import { IPeriodicPay } from '@/api/services/types'
import { getPeriodicPays } from '@/api/services/req'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'AddPPay'
})
export default class extends Vue {
  private pservices: IPeriodicPay[] = []
  private $perms!: CurrentPermissions
  private loading = false
  private pserviceId = 0
  private deadline = ''

  get addDisabledGetter(): boolean {
    const isRights = this.$perms.customers.add_periodicpayforid
    const isData = this.pserviceId > 0 && this.deadline !== ''
    return !(isRights && isData)
  }

  private async onSubmit() {
    this.loading = true
    try {
      const { data } = await CustomerModule.MakePeriodicPay({
        periodic_pay_id: this.pserviceId,
        next_pay: this.deadline
      })
      this.loading = false
      this.$message.success(data)
      this.$emit('done')
    } catch (err) {
      this.$message.error(err)
    }
  }

  created() {
    this.loadPService()
  }

  private async loadPService() {
    this.loading = true
    try {
      const { data } = await getPeriodicPays() as any
      this.pservices = data as IPeriodicPay[]
    } finally {
      this.loading = false
    }
  }
}
</script>
