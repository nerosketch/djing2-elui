<template lang="pug">
div
  el-row(v-if="contracts.length > 0" :gutter="15")
    el-col.col_vert_space(
      v-for="(c, i) in contracts"
      :key="i"
      :sm="24"
      :md="12"
      :xl="6")
      el-card
        template(#header)
          | {{ $t('contractDocs.customerContract') }} № {{ c.contract_number }}

          el-button.card_del_btn(
            v-show="c.id"
            type="text"
            icon="el-icon-close"
            @click="delContract(c)")

        contract-form(:contract="c")

  span(v-else) {{ $t('contractDocs.noContracts') }}

  slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ICustomerContract } from './api/types'
import { delContract, getContracts } from './api/reqs'
import ContractForm from './contract-form.vue'

@Component({
  name: 'ContractsTab',
  components: {
    ContractForm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private uid!: number

  private contracts: ICustomerContract[] = []

  public async loadContracts() {
    const { data } = await getContracts({
      customer: this.uid
    } as any)
    this.contracts = data.results
  }

  created() {
    this.loadContracts()
  }

  private delContract(c: ICustomerContract) {
    if (!c.id) return
    this.$confirm(this.$tc('contractDocs.delQuestion'), {
      confirmButtonText: this.$tc('yes'),
      cancelButtonText: this.$tc('no')
    }).then(() => {
      delContract(c.id as any).then(() => {
        this.$message.success(
          this.$tc('contractDocs.delOk')
        )
        this.loadContracts()
      })
    })
  }
}
</script>
