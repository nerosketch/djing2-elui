<template lang="pug">
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerLog } from '@/api/customers/types'
import { getCustomerPayLog } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'Finance'
})
export default class extends Vue {
  private finlog: ICustomerLog[] = []
  private loading = false

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
}
</script>
