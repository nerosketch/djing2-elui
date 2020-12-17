<template lang="pug">
  el-table(
    v-loading='loading'
    :data='tels'
    border fit
    size='small'
  )
    el-table-column(
      label="Владелец телефона"
      prop='owner_name'
    )

    el-table-column(
      label="Телефон"
    )
      template(v-slot:default="{row}")
        el-link(:href="`tel:${row.telephone}`") {{ row.telephone }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IAdditionalTelephone } from '@/api/customers/types'
import { getTelephones } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'AdditionalTels'
})
export default class extends Vue {
  private loading = false
  private tels: IAdditionalTelephone[] = []

  private async loadTels() {
    this.loading = true
    try {
      const { data } = await getTelephones(CustomerModule.pk) as any
      this.tels = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadTels()
  }
}
</script>
