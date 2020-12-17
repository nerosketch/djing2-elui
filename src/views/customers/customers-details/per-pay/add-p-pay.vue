<template lang="pug">
  el-form(
    v-loading='loading'
    size="mini"
  )
    p deadline {{ deadline }}
    p pserviceId {{ pserviceId }}
    el-form-item(
      label="Периодический платёж"
      prop='service_id'
    )
      el-select(v-model="pserviceId")
        el-option(
          v-for="srv in pservices"
          :key="srv.pk"
          :label="srv.name"
          :value="srv.pk"
        )
    el-form-item(
      label="Дата следующего платежа"
      prop='deadline'
    )
      el-date-picker(
        v-model="deadline"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm"
        format="d MMM yyyy HH:mm"
      )
    el-form-item
      el-button(
        type="success" @click="onSubmit"
        :loading="loading"
        :disabled="addDisabledGetter"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { CurrentPermissions } from '@/store/current-user-permissions'
import { IPeriodicPay } from '@/api/services/types'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'AddPPay'
})
export default class extends Vue {
  @Prop({ required: true }) pservices!: IPeriodicPay[]
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
}
</script>
