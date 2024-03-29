<template lang="pug">
  div
    el-table(
      :data="branches"
      v-loading="loading"
      :empty-text="$t('customersLegal.branchNotAttached')"
      border
      fit)
      el-table-column(:label="$t('customers.contractNum.s')" prop="username")
        template(#default="{row}")
          router-link.el-link.el-link--primary.is-underline(
            :to="{name: 'customerDetails', params:{uid: row.id }}"
          ) {{ row.username }}

      el-table-column(:label="$t('customersLegal.fname')" prop="full_name")

      el-table-column(:label="$t('customersLegal.tel')" prop="telephone")

      el-table-column(label="#" width="50")
        template(#default="{row}")
          el-button(
            icon="el-icon-close"
            type="danger"
            circle
            @click="delBranch(row)")

      template(#append)
        el-button(
          type="success"
          icon="el-icon-plus"
          @click="addBranch")
          | {{ $t('add') }}

    el-dialog(
      :title="$t('customersLegal.addBranch')"
      :visible.sync="branchFormVisible"
      :close-on-click-modal="false")
      add-branch-frm(@done="branchFormDone")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ICustomer } from '@/api/customers/types'
import { getLegalBranches } from '@/api/customers_legal/req'
import { IDRFRequestListParameters } from '@/api/types'
import AddBranchFrm from './add-branch-frm.vue'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'

@Component({
  name: 'LegalBranches',
  components: {
    AddBranchFrm
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private customerId!: number

  private branches: ICustomer[] = []

  private loading = false
  private branchFormVisible = false

  private async loadBranches(customerId: number) {
    const params: IDRFRequestListParameters = {
      page: 0,
      page_size: 0,
      fields: 'id,username,full_name,telephone'
    }
    this.loading = true
    try {
      const { data } = await getLegalBranches(customerId, params)
      this.branches = data as ICustomer[]
    } finally {
      this.loading = false
    }
  }

  created() {
    if (this.customerId) {
      this.loadBranches(this.customerId)
    }
  }

  @Watch('customerId')
  private onChangeCustomerId(cuid: number) {
    this.loadBranches(cuid)
  }

  private addBranch() {
    this.branchFormVisible = true
  }

  private branchFormDone() {
    this.branchFormVisible = false
    this.loadBranches(this.customerId)
  }

  private delBranch(customer: ICustomer) {
    this.$confirm(`${this.$tc('customersLegal.delBranch')} "${customer.full_name}"?`).then(async() => {
      const newBranches = CustomerLegalModule.branches.filter(b => b !== customer.id)
      await CustomerLegalModule.updateCustomerLegal({ branches: newBranches })
      this.loadBranches(this.customerId)
      this.$message.success(
        this.$tc('customersLegal.branchDeleted')
      )
    })
  }
}
</script>
