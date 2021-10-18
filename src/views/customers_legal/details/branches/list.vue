<template lang="pug">
  el-table(
    :data="branches"
    v-loading="loading"
    empty-text="Филиалы не назначены"
    border fit
  )
    el-table-column(
      label="asdasd"
    )
</template>

<script lang="ts">
import { ICustomer } from '@/api/customers/types'
import { getLegalBranches } from '@/api/customers_legal/req'
import { IDRFRequestListParameters } from '@/api/types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'LegalBranches'
})
export default class extends Vue {
  @Prop({ default: 0 }) private customerId!: number

  private branches: ICustomer[] = []

  private loading = false

  private async loadBranches(customerId: number) {
    const params: IDRFRequestListParameters = {
      page: 0,
      page_size: 0,
      fields: ''
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
}
</script>
