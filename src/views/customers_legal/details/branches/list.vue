<template lang="pug">
div
  el-table(
    :data="branches"
    v-loading="loading"
    empty-text="Филиалы не назначены"
    border fit
  )
    el-table-column(
      label="Номер договора"
      prop="username"
    )
      template(v-slot:default="{row}")
        router-link.el-link.el-link--primary.is-underline(
          :to="{name: 'customerDetails', params:{uid: row.id }}"
        ) {{ row.username }}
    el-table-column(
      label="Имя физ лица"
      prop="full_name"
    )
    el-table-column(
      label="Номер телефона"
      prop="telephone"
    )
    el-table-column(
      label="#"
      width='50'
    )
      template(v-slot:default="{row}")
        el-button(
          icon="el-icon-close"
          type='danger'
          circle
          @click="delBranch(row)"
        )
    template(v-slot:append)
      el-button(
        type='success' icon='el-icon-plus',
        @click="addBranch"
      ) Добавить
  el-dialog(
    title='Добавить филиал'
    :visible.sync='branchFormVisible'
    :close-on-click-modal="false"
  )
    add-branch-frm(
      @done="branchFormDone"
    )

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
    this.$confirm(`Удалить филиал "${customer.full_name}"?`).then(async () => {
      const branches = CustomerLegalModule.branches
      const br = branches.findIndex(b => b === customer.id)
      if (br > -1) {
        branches.splice(br, 1)
        await CustomerLegalModule.updateCustomerLegal({ branches })
        this.loadBranches(this.customerId)
        this.$message.success('Филиал отвязан')
      }
    })
  }
}
</script>
