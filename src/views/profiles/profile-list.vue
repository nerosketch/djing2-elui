<template lang="pug">
  div
    datatable(
      :columns="tableColumns"
      :getData="getAllProfiles"
      :tableRowClassName="rowColor"
      :heightDiff="190"
      widthStorageNamePrefix="profiles"
      ref="tbl")
      template(v-slot:avatar="{row}")
        el-avatar(:src="row.avatar || defAvaConst", shape="square")
    
      template(v-slot:username="{row}")
        router-link(:to="{name: 'profileDetail', params:{ profileUname: row.username }}")
          el-link(type="primary", :icon="row.is_superuser ? 'el-icon-warning' : ''")
            | {{ row.username }}
    
      template(v-slot:telephone="{row}")
        el-link(type="primary", :href="`tel:${row.telephone}`")
          | {{ row.telephone }}
    
      template(v-slot:btn="{row}")
        el-button(
          type="danger"
          icon="el-icon-close"
          circle
          @click="delUserProfile(row)"
          :disabled="!$perms.is_superuser")
    
      el-button(
        icon="el-icon-plus"
        @click="addNewProfile"
        :disabled="!$perms.is_superuser")
        | {{ $t('add') }}
  
    el-dialog(
      title="$t('dobavit-uchyotku')"
      :visible.sync="profileFormDialog"
      :close-on-click-modal="false")
      profile-form(v-on:done="addProfileDone")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { DEFAULT_USER_AVA, IUserProfile } from '@/api/profiles/types'
import { getProfiles, delProfile } from '@/api/profiles/req'
import ProfileForm from './profile-form.vue'
import { UserProfileModule } from '@/store/modules/profiles/user-profile'

class DataTableComp extends DataTable<IUserProfile> {}

interface ITableRowClassName {
  row: IUserProfile
  rowIndex: number
}

@Component({
  name: 'ProfileList',
  components: {
    datatable: DataTableComp,
    ProfileForm
  }
})
export default class extends Vue {
  public readonly $refs!: {
    tbl: DataTableComp
  }

  private profileFormDialog = false

  private defAvaConst = DEFAULT_USER_AVA

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'avatar',
      label: this.$t('foto'),
      'min-width': 60,
      align: DataTableColumnAlign.CENTER
    },
    {
      prop: 'username',
      label: this.$t('login-3')
    },
    {
      prop: 'fio',
      label: this.$t('fio-0'),
      'min-width': 250
    },
    {
      prop: 'telephone',
      label: this.$t('telefon'),
      'min-width': 120
    },
    {
      prop: 'email',
      label: this.$t('adres-elektronnoi-pochty'),
      'min-width': 250
    },
    {
      prop: 'btn',
      label: this.$t('key-2'),
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private getAllProfiles(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'avatar,username,fio,telephone,email,is_active,is_superuser'
    }
    return getProfiles(params)
  }

  private async addNewProfile() {
    UserProfileModule.RESET_ALL_PROFILE()
    this.profileFormDialog = true
  }

  private async addProfileDone(newProfile: IUserProfile) {
    this.profileFormDialog = false
    this.$router.push({ name: 'profileDetail', params: { profileUname: newProfile.username } })
  }

  private rowColor(r: ITableRowClassName) {
    return r.row.is_active ? '' : 'error-row'
  }

  private delUserProfile(usr: IUserProfile) {
    this.$confirm(this.$t('udalit-uchyotnuyu-zapis')).then(async() => {
      await delProfile(usr.username)
      this.$message.success(this.$t('uchyotnaya-zapis-udalena'))
    })
  }
}
</script>
