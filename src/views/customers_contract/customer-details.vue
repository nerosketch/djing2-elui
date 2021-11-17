<template lang="pug">
  customer-details(
    :uid='uid'
  )
    template(#additional_tabs)
      el-tab-pane(
        label="Договор абонента"
        name="contracts"
        lazy
      )
        template(v-if="contracts.length > 0")
          el-row(:gutter="15")
            el-col.col_vert_space(
              v-for="(c, i) in contracts"
              :key="i"
              :sm='24'
              :md='12'
              :xl='6'
            )
              el-card
                template(#header) Договор абонента № {{ c.contract_number }}
                  el-button.card_del_btn(
                    v-show="c.id"
                    type="text" icon='el-icon-close'
                    @click="delContract(c)"
                  )
                contract-form(
                  :contract="c"
                )
        span(v-else) Нет договоров &nbsp;
        el-button(
          @click="newContractFormVisible=true"
        ) Добавить

    el-dialog(
      :visible.sync="newContractFormVisible"
      title="Добавить договор абоненту"
    )
      contract-form(
        @added="doneAdd"
        @changed="doneChange"
      )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import CustomerDetails from '@/views/customers/customer-details.vue'
import ContractForm from './contract-form.vue'
import { ICustomerContract } from './api/types'
import { delContract, getContracts } from './api/reqs'

@Component({
  name: 'CustomerContractDetails',
  components: {
    CustomerDetails,
    ContractForm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private contracts: ICustomerContract[] = []
  private newContractFormVisible = false

  private async loadContracts() {
    const { data } = await getContracts({
      customer: this.uid
    } as any)
    this.contracts = data as any
  }

  created() {
    this.loadContracts()
  }

  private doneChange(c: ICustomerContract) {
    this.newContractFormVisible = false
    this.loadContracts()
  }
  private doneAdd(c: ICustomerContract) {
    this.newContractFormVisible = false
    this.loadContracts()
  }

  private delContract(c: ICustomerContract) {
    if (!c.id) return
    this.$confirm('Удалить договор с абонентом?', {
      confirmButtonText: 'да',
      cancelButtonText: 'нет'
    }).then(() => {
      delContract(c.id as any).then(() => {
        this.$message.success('Договор успешно удалён')
        this.loadContracts()
      })
    })
  }
}
</script>
