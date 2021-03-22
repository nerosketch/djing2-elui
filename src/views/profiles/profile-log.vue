<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllLog"
      :heightDiff='201'
      widthStorageNamePrefix='profile_log'
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserProfileLog } from '@/api/profiles/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getProfileLogs } from '@/api/profiles/req'

class DataTableComp extends DataTable<IUserProfileLog> {}

@Component({
  name: 'ProfileLog',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'action_date',
      label: 'Дата',
      'min-width': 150
    },
    {
      prop: 'additional_text',
      label: 'Дополнительное',
      'min-width': 400
    },
    {
      prop: 'do_type_text',
      label: 'Описание',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private getAllLog(params?: IDRFRequestListParameters) {
    return getProfileLogs(params, this.$store.state.userprofile.pk)
  }
}
</script>
