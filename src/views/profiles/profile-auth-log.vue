<template>  
  <div class="app-container">
    <datatable :columns="tableColumns" :getData="getAllLog" :heightDiff="201" widthStorageNamePrefix="auth_log"></datatable>
  </div>
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
      label: 'Время',
      'min-width': 150
    },
    {
      prop: 'remote_ip',
      label: 'Ip входа',
      'min-width': 130
    },
    {
      prop: 'user_agent',
      label: 'Браузер'
    }
  ]

  private getAllLog(params?: IDRFRequestListParameters) {
    return getAuthLog(params, this.$store.state.userprofile.id)
  }
}
</script>
