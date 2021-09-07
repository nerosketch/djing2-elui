<template lang="pug">
  dynamic-content-fields(
    :contents="contents"
    @save="saveData"
    v-loading="loading"
  )
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import DynamicContentFields from '@/components/DynamicFields/dynamic-content-fields.vue'
import { IDynamicContentField } from '@/api/dynamic-fields/types'
import { changeContentFields, getCombinedContentFields } from '@/api/customers/req'

interface IDynamicContentCustomerField extends IDynamicContentField {
  customer: number
}

@Component({
  name: 'CustomerDynamicFields',
  components: {
    DynamicContentFields
  }
})
export default class extends Vue {
  private loading = false

  private contents: IDynamicContentCustomerField[] = []

  private async saveData() {
    this.loading = true
    try {
      const { data } = await changeContentFields(this.contents)
      this.contents = data as any
    } finally {
      this.loading = false
    }
  }

  public async loadContentFields(customerId: number) {
    this.loading = true
    try {
      const { data } = await getCombinedContentFields(customerId)
      this.contents = data.map(c => (Object.assign(c, {
        customer: customerId
      })))
    } finally {
      this.loading = false
    }
  }

  @Watch('$store.state.customer.pk')
  private onChCustomer(customerId: number) {
    this.loadContentFields(customerId)
  }

  created() {
    const customerId = this.$store.state.customer.pk
    if (customerId) {
      this.loadContentFields(customerId)
    }
  }
}
</script>
