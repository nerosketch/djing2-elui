<template lang="pug">
el-card(style='margin-bottom:20px;')
  template(v-slot:header)
    .clearfix
      span {{ $t('info') }}
  .user-profile
    .box-center
      pan-thumb(
        :image='$store.state.userprofile.avatar || defAvaConst'
        height="100px"
        width="100px"
        :hoverable='false'
      )
    .box-center
      .user-name.text-center
        | {{ $store.state.userprofile.username }}
      .user-role.text-center.text-muted
        | {{ $store.state.userprofile.fio }}
  .user-bio
    .user-education.user-bio-section
      .user-bio-section-body
        dl
          dt
            b {{ $t('telephone') }}
          dd {{ $store.state.userprofile.telephone }}
          dt
            b {{ $t('login') }}
          dd {{ $store.state.userprofile.username }}
          dt
            b {{ $t('nameAndFatherhood') }}
          dd {{ $store.state.userprofile.fio }}
          dt
            b {{ $t('profiles.isActive') }}
          dd
            i.el-icon-circle-check(v-if="$store.state.userprofile.is_active")
            i.el-icon-circle-close(v-else)
          dt
            b {{ $t('profiles.isSuperuser') }}
          dd
            i.el-icon-circle-check(v-if="$store.state.userprofile.is_superuser")
            i.el-icon-circle-close(v-else)
    .user-skills.user-bio-section
      .user-bio-section-body
        .progress-item
          span {{ $t('levelOfAccess') }}
          el-progress(
            :percentage='$store.state.userprofile.access_level'
            :status='$store.state.userprofile.access_level === 100 ? "success" : undefined'
          )
        .progress-item
          span {{ $t('someOtherProgress') }}
          el-progress(:percentage='45')
        .progress-item
          span {{ $t('somethingElse') }}
          el-progress(:percentage='4')
        .progress-item
          span {{ $t('somethingFinished') }}
          el-progress(:percentage='100' status='success')

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { DEFAULT_USER_AVA } from '@/api/profiles/types'
import PanThumb from '@/components/PanThumb/index.vue'
import BooleanIcon from '@/components/boolean-icon.vue'

@Component({
  name: 'UserCard',
  components: {
    PanThumb,
    BooleanIcon
  }
})
export default class extends Vue {
  private defAvaConst = DEFAULT_USER_AVA
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  // margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    // padding: 15px 0;
  }
}
</style>
