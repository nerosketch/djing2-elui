<template lang="pug">
  customer-details(:uid="uid")
    template(#additional_tabs)
      el-tab-pane(
        :label="$t('contractDocs.customerContract')"
        name="contracts"
        lazy
      )
        contracts-tab(
          :uid="uid"
          ref="tabcont"
        )
          el-button(@click="newContractFormVisible=true")
            | {{ $t('add') }}

    el-dialog(
      :visible.sync="newContractFormVisible"
      :title="$t('contractDocs.addCustomerContract')"
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
import ContractsTab from './contracts-tab.vue'

@Component({
  name: 'CustomerContractDetails',
  components: {
    CustomerDetails,
    ContractForm,
    ContractsTab
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tabcont: ContractsTab
  }

  @Prop({ default: 0 }) private uid!: number

  private newContractFormVisible = false

  private doneChange() {
    this.newContractFormVisible = false
    this.$refs.tabcont.loadContracts()
  }

  private doneAdd() {
    this.newContractFormVisible = false
    this.$refs.tabcont.loadContracts()
  }
}
</script>
