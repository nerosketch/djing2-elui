<template lang="pug">
div
  el-table(
    v-loading='loading'
    :data='services'
    border fit
    size='small'
  )
    el-table-column(
      align="center"
      label="ID"
      width="60"
      prop='pk'
    )
  el-button(
    type='primary' size='mini'
    @click="pSrvDialog=true"
  ) Добавить периодический платёж

  el-dialog(
      title="Добавить периодический платёж"
      :visible.sync="pSrvDialog"
    )
      add-p-pay(
        v-on:done="pSrvDialog=false"
        :pservices="pservices"
      )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { IPeriodicPay } from '@/api/services/types'
import { getPeriodicPays } from '@/api/services/req'
import AddPPay from './per-pay/add-p-pay.vue'

@Component({
  name: 'SrvList',
  components: {
    AddPPay
  }
})
export default class extends Vue {
  private pservices: IPeriodicPay[] = []
  private loading = false
  private pSrvDialog = false

  created() {
    this.loadPService()
  }

  private async loadPService() {
    this.loading = true
    try {
      const { data } = await getPeriodicPays()
      this.pservices = data as IPeriodicPay[]
    } finally {
      this.loading = false
    }
  }
}
</script>
