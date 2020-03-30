<template lang="pug">
  .app-container
    el-table(
      v-loading='customersLoading'
      :data="customersList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      size='small'
    )
      el-table-column(
        align="center"
        label="ID"
        width="60"
      )
        template(slot-scope="scope") {{ scope.$index }}
      el-table-column(
        label="Логин"
        width="90"
      )
        el-link(slot-scope="scope" type="primary" href="#sodf") {{ scope.row.username }}
      el-table-column(
        label="ФИО"
      )
        template(slot-scope="scope") {{ scope.row.fio }}
      el-table-column(
        label="Улица"
      )
        template(slot-scope="scope") {{ scope.row.street_name }}
      el-table-column(
        label="Квартира"
      )
        template(slot-scope="scope") {{ scope.row.house }}
      el-table-column(
        label="Телефон"
      )
        el-link(slot-scope="scope" type="primary" :href="`tel:${scope.row.telephone}`") {{ scope.row.telephone }}
      el-table-column(
        label="Услуга"
      )
        el-link(slot-scope="scope" type="primary" href='#sdf') {{ scope.row.service_title }}
      el-table-column(
        label="Баланс"
      )
        template(slot-scope="scope") {{ scope.row.balance }}
      el-table-column(
        label="Шлюз"
      )
        template(slot-scope="scope") {{ scope.row.gateway_title }}
      el-table-column(
        label="Ping"
        align="center"
        width="90"
      )
        el-button(slot-scope="scope" type="primary" size="mini") Ping

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ICustomerState } from '@/store/modules/customers/customer'
import { getCustomers } from '@/api/customers'

@Component({
  name: 'CustomersList',
  props: {
    groupId: {
      type: Number,
      required: true
    },
    groupName: {
      type: String,
      default: null
    }
  }
})
export default class extends Vue {
  private customersLoading: boolean = true
  private customersList: ICustomerState[] = []
  // private groupsQuery = {
  //   page: 1,
  //   page_size: 20
  // }

  created() {
    this.getAllCustomers()
  }

  private async getAllCustomers() {
    this.customersLoading = true
    const { data } = await getCustomers()
    this.customersList = data.results
    this.customersLoading = false
  }
}
</script>
