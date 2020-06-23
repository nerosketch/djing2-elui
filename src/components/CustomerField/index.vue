<template lang="pug">
  el-autocomplete.inline-input.wideautocomplete(
    v-model="inpName"
    :fetch-suggestions="querySearch"
    :loading="loading"
    placeholder="Начни вводить имя абонента"
    trigger-on-focus
    @select="handleSelect"
    value-key="full_name"
    width="300px"
  )

</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { findCustomers } from '@/api/customers/req';
import { ICustomer } from '@/api/customers/types';

@Component({
  name: 'CustomerField'
})
export default class extends Vue {
  private loading = false
  private inpName = ''

  @Prop({ default: '' })
  private defaultName!: string

  private querySearch(queryString: string, cb: any) {
    if(this.loading) return
    this.loading = true
    findCustomers(queryString).then(({ data }) => {
      cb(data.results)
      this.loading = false
    })
  }

  private handleSelect(c: ICustomer) {
    this.$emit('input', c.pk)
  }

  created() {
    this.inpName = this.defaultName
  }
}
</script>

<style>
.wideautocomplete {
  width: 100%;
}
</style>