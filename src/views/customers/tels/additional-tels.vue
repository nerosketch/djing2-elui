<template lang="pug">
  el-table(
    v-loading='loading'
    :data='tels'
    border fit
    size='small'
  )
    el-table-column(
      label="Владелец телефона"
      prop="owner_name"
    )

    el-table-column(
      label="Телефон"
    )
      template(v-slot:default="{row}")
        el-link(:href="`tel:${row.telephone}`") {{ row.telephone }}
    el-table-column(
      label="Удалить"
      width="75"
      align='center'
    )
      template(v-slot:default="{row}")
        el-button(
          icon='el-icon-close'
          type='text'
          circle
          @click="delTel(row)"
        )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IAdditionalTelephone } from '@/api/customers/types'
import { getTelephones } from '@/api/customers/req'
import { CustomerModule } from '@/store/modules/customers/customer'
import { AdditionalTelephoneModule } from '@/store/modules/customers/telephones'

@Component({
  name: 'AdditionalTels'
})
export default class extends Vue {
  private loading = false
  private tels: IAdditionalTelephone[] = []

  public async loadTels() {
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

  private delTel(tel: IAdditionalTelephone) {
    this.$confirm('Удалить дополнительный номер телефона?').then(async() => {
      await AdditionalTelephoneModule.DelTelephone(tel.id)
      this.$message.success('Успешно удалено')
      this.loadTels()
    })
  }
}
</script>
