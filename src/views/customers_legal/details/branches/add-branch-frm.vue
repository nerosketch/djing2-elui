<template lang="pug">
  el-form(:model="frmMod" v-loading="loading")
    el-form-item(:label="$t('customersLegal.branch')" prop="customer")
      customer-field(v-model="frmMod.branch")

    el-form-item
      el-button(
        type="primary"
        icon="el-icon-plus"
        :disabled="!isFilled"
        @click="onSubmit")
        | {{ $t('add') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerField from '@/components/CustomerField/index.vue'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'

@Component({
  name: 'AddBranchFrm',
  components: {
    CustomerField
  }
})
export default class extends Vue {
  private loading = false

  private frmMod: {
    branch: number | null
  } = {
    branch: null
  }

  private async onSubmit() {
    if (this.frmMod.branch) {
      const newBranches = CustomerLegalModule.branches.concat([this.frmMod.branch])
      this.loading = true
      try {
        const customerLegal = await CustomerLegalModule.updateCustomerLegal({ branches: newBranches })
        this.$message.success(this.$tc('saved'))
        this.$emit('done', customerLegal)
      } finally {
        this.loading = false
      }
    }
  }

  private get isFilled() {
    return Boolean(this.frmMod.branch)
  }
}
</script>
