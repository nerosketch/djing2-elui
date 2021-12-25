<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllLog"
      :heightDiff="201"
      widthStorageNamePrefix="auth_log")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { IUserProfileAuthLog } from '@/api/profiles/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getAuthLog } from '@/api/profiles/req'

class DataTableComp extends DataTable<IUserProfileAuthLog> {}

@Component({
  name: 'ProfileAuthLog',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'time',
      label: this.$t('time'),
      'min-width': 150
    },
    {
      prop: 'remote_ip',
      label: this.$t('andGoIn'),
      'min-width': 130
    },
    {
      prop: 'user_agent',
      label: this.$t('brauser')
    }
  ]

  private getAllLog(params?: IDRFRequestListParameters) {
    return getAuthLog(params, this.$store.state.userprofile.id)
  }
}
</script>
