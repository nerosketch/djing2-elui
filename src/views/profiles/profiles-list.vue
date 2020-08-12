<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllProfiles"
      :tableRowClassName="rowColor"
      :loading="loading"
      :heightDiff='95'
      ref='tbl'
    )
      template(v-slot:ava="{row}")
        el-avatar(:src="row.avatar" size='medium' shape="square")

      template(v-slot:username="{row}")
        el-link(type="primary")
          router-link(:to="{name: 'profileDetail', params:{ profileUname: row.username }}") {{ row.username }}

      template(v-slot:fio="{row}") {{ row.fio }}

      template(v-slot:telephone="{row}")
        el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

      template(v-slot:email="{row}") {{ row.email }}

      template(v-slot:btn="{row}")
        el-button(
          type="danger" size="mini"
          icon='el-icon-close' circle
        )
      el-button(
        icon='el-icon-plus'
        size='mini'
        @click="addNewProfile"
      ) Добавить
    el-dialog(
      title="Добавить учётку"
      :visible.sync="profileFormDialog"
    )
      profile-form(
        v-on:done="addProfileDone"
        v-on:fail="addProfileFail"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { IUserProfile } from '@/api/profiles/types'
import { getProfiles } from '@/api/profiles/req'
import ProfileForm from './profile-form.vue'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'

class DataTableComp extends DataTable<IUserProfile> {}

interface ITableRowClassName {
  row: IUserProfile
  rowIndex: number
}

@Component({
  name: 'ProfilesList',
  components: {
    'datatable': DataTableComp,
    ProfileForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }
  private loading = false
  private profileFormDialog = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'ava',
      label: 'Фото',
      'min-width': 60,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'username',
      label: 'Логин'
    },
    {
      prop: 'fio',
      label: 'ФИО',
      'min-width': 250
    },
    {
      prop: 'telephone',
      label: 'Телефон',
      'min-width': 120
    },
    {
      prop: 'email',
      label: 'Адрес электронной почты',
      'min-width': 250
    },
    {
      prop: 'btn',
      label: '—',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async getAllProfiles(params?: IDRFRequestListParameters) {
    this.loading = true
    if (params) {
      params['fields'] = 'avatar,username,fio,telephone,email,is_active'
    }
    const r = await getProfiles(params)
    this.loading = false
    return r
  }

  private async addNewProfile() {
    UserProfileModule.RESET_ALL_PROFILE()
    this.profileFormDialog = true
  }

  private async addProfileDone(newProfile: IUserProfile) {
    this.profileFormDialog = false
    this.$router.push({ name: 'profileDetail', params: { profileUname: newProfile.username } })
  }

  private async addProfileFail() {
    this.profileFormDialog = false
  }

  private rowColor(r: ITableRowClassName) {
    return r.row.is_active ? '' : 'error-row'
  }
}
</script>
