<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllLog"
      :loading="loading"
      :heightDiff='185'
      ref='tbl'
    )
      template(v-slot:action_date="{row}") {{ row.action_date }}

      template(v-slot:additional_text="{row}") {{ row.additional_text }}

      template(v-slot:do_type_text="{row}") {{ row.do_type_text }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserProfileLog } from '@/api/profiles/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getProfileLogs } from '@/api/profiles/req'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'

class DataTableComp extends DataTable<IUserProfileLog> {}

@Component({
  name: 'ProfileLog',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private loading = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'action_date',
      label: 'Дата',
      width: 150
    },
    {
      prop: 'additional_text',
      label: 'Дополнительное'
    },
    {
      prop: 'do_type_text',
      label: 'Описание',
      width: 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async getAllLog(params?: IDRFRequestListParameters) {
    this.loading = true
    const r = await getProfileLogs(params, UserProfileModule.pk)
    this.loading = false
    return r
  }
}
</script>
