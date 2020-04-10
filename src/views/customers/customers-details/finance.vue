<template lang="pug">
div
  el-table(
    v-loading='loading'
    :data='finlog'
    border fit
    size='small'
  )
    el-table-column(
      align="center"
      label="Сумма"
      width="80"
    )
      template(slot-scope="{row}") {{ row.cost }}
    el-table-column(
      label="Дата оплаты"
      width='160'
    )
      template(slot-scope="{row}") {{ row.date }}
    el-table-column(
      label="Назначил"
      width='180'
    )
      template(slot-scope="{row}") {{ row.author_name || 'Система' }}
    el-table-column(
      label="Комментарий"
    )
      template(slot-scope="{row}") {{ row.comment }}
  el-button(type="primary" @click="addCashDialog=true" size='small') Пополнить счёт
  el-dialog(
    title="Пополнить счёт"
    :visible.sync="addCashDialog"
    width="30%"
  )
    add-cash(v-on:done="addCashDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerLog } from '@/api/customers/types'
import { getCustomerPayLog } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import AddCash from './add-cash.vue'

@Component({
  name: 'Finance',
  components: { AddCash }
})
export default class extends Vue {
  private finlog: ICustomerLog[] = []
  private loading = false
  private addCashDialog = false

  private async loadLog() {
    this.loading = true
    const r = await getCustomerPayLog({
      page: 1,
      page_size: 500,
      customer: CustomerModule.pk
    })
    this.finlog = r.data.results
    this.loading = false
  }

  created() {
    this.loadLog()
  }

  private addCashDone(cost: number) {
    this.addCashDialog = false
    this.loadLog()
    this.$message.success(`Счёт пополнен на ${cost}`)
  }
}
</script>
