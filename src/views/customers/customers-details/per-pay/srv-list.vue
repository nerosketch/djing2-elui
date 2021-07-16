<template lang="pug">
div
  el-table(
    v-loading='loading'
    :data='pservices'
    border fit
    size='small'
  )
    el-table-column(
      label="Последний платёж"
      prop='last_pay'
    )
    el-table-column(
      label="Следующий платёж"
      prop='next_pay'
    )
    el-table-column(
      label="Название"
      prop='service_name'
    )
    el-table-column(
      label="Тип расчёта"
      prop='service_calc_type'
    )
    el-table-column(
      label="Цена"
      prop='service_amount'
    )
    el-table-column(
      label="Удалить"
    )
      template(v-slot:default="{row}")
        el-button(
          size='mini' icon='el-icon-close'
          circle type='danger'
          @click="delP4IdPay(row)"
        )
  el-button(
    type='primary' size='mini'
    @click="pSrvDialog=true"
  ) Добавить периодический платёж

  el-dialog(
    title="Добавить периодический платёж"
    :visible.sync="pSrvDialog"
    :close-on-click-modal="false"
  )
    add-p-pay(
      v-on:done="addPPayDone"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IPeriodicPayForId } from '@/api/customers/types'
import { getAssignedPeriodicPays, delAssignedPeriodicPay } from '@/api/customers/req'
import AddPPay from './add-p-pay.vue'

@Component({
  name: 'PeriodicServicesList',
  components: {
    AddPPay
  }
})
export default class extends Vue {
  private pservices: IPeriodicPayForId[] = []
  private loading = false
  private pSrvDialog = false

  created() {
    this.loadPIdServices()
  }

  private async loadPIdServices() {
    this.loading = true
    try {
      const { data } = await getAssignedPeriodicPays(
        this.$store.state.customer.pk
      )
      this.pservices = data as IPeriodicPayForId[]
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  private addPPayDone() {
    this.loadPIdServices()
    this.pSrvDialog = false
  }

  private delP4IdPay(pay: IPeriodicPayForId) {
    this.$confirm('Удалить периодическое снятие средств?').then(async() => {
      await delAssignedPeriodicPay(pay.id)
      this.loadPIdServices()
      this.$message.success('Удалено')
    })
  }
}
</script>
