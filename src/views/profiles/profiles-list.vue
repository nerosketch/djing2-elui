<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllProfiles"
      :loading="loading"
      ref='tbl'
    )
      el-avatar(slot="ava" slot-scope="{row}" :src="row.avatar" size='medium' shape="square")

      el-link(slot="username" slot-scope="{row}" type="primary")
        router-link(:to="{name: 'profileDetail', params:{ profileUname: row.username }}") {{ row.username }}

      span(slot="fio" slot-scope="{row}") {{ row.fio }}

      el-link(slot="telephone" slot-scope="{row}" type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

      span(slot="email" slot-scope="{row}") {{ row.email }}

      el-button(
        slot="btn" slot-scope="{row}"
        type="danger" size="mini"
        icon='el-icon-close' circle
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserProfile } from '@/api/profiles/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getProfiles } from '@/api/profiles/req'

class DataTableComp extends DataTable<IUserProfile> {}

@Component({
  name: 'ProfilesList',
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
      prop: 'ava',
      label: 'Фото',
      width: 60,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'username',
      label: 'Логин'
    },
    {
      prop: 'fio',
      label: 'ФИО'
    },
    {
      prop: 'telephone',
      label: 'Телефон'
    },
    {
      prop: 'email',
      label: 'Адрес электронной почты'
    },
    {
      prop: 'btn',
      label: '—',
      width: 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  created() {
    this.getAllProfiles()
  }

  private async getAllProfiles(params?: IDRFRequestListParameters) {
    this.loading = true
    const r = await getProfiles(params)
    this.loading = false
    return r
  }
}
</script>
