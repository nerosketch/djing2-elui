<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="getAllProfiles"
      :loading="loading"
      ref='tbl'
    )
      template(v-slot:ava="{row}")
        el-avatar(:src="row.avatar" size='medium' shape="square")

      template(v-slot:username="{row}")
        el-link(type="primary")
          router-link(:to="{name: 'profileDetail', params:{ profileUname: row.username }}") {{ row.username }}

      template(v-slot:fio="{row}")
        span {{ row.fio }}

      template(v-slot:telephone="{row}")
        el-link(type="primary" :href="`tel:${row.telephone}`") {{ row.telephone }}

      template(v-slot:email="{row}")
        span {{ row.email }}

      template(v-slot:btn="{row}")
        el-button(
          type="danger" size="mini"
          icon='el-icon-close' circle
        )
    el-button(
      type='success'
      icon='el-icon-plus'
      size='small'
      @click="addNewProfile"
    ) Добавить
    el-dialog(
      title="Добавить учётку"
      :visible.sync="profileFormDialog"
    )
      profile-form(v-on:done="addProfileDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IUserProfile } from '@/api/profiles/types'
import { IDRFRequestListParameters } from '@/api/types'
import { getProfiles } from '@/api/profiles/req'
import ProfileForm from './profile-form.vue'
import { UserProfileModule } from '../../store/modules/profiles/user-profile'

class DataTableComp extends DataTable<IUserProfile> {}

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

  private async getAllProfiles(params?: IDRFRequestListParameters) {
    this.loading = true
    if (params) {
      params['fields'] = 'avatar,username,fio,telephone,email'
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
}
</script>
