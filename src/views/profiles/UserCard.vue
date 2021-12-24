<template>
  <el-card style="margin-bottom:20px;">
    <template v-slot:header>
      <div class="clearfix"><span>{{ $t('info-0') }}</span></div>
    </template>
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="$store.state.userprofile.avatar || defAvaConst" height="100px" width="100px" :hoverable="false"></pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ $store.state.userprofile.username }}</div>
        <div class="user-role text-center text-muted">{{ $store.state.userprofile.fio }}</div>
      </div>
    </div>
    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-body">
          <dl>
            <dt><b>{{ $t('telefon-0') }}</b></dt>
            <dd>{{ $store.state.userprofile.telephone }}</dd>
            <dt><b>{{ $t('login-4') }}</b></dt>
            <dd>{{ $store.state.userprofile.username }}</dd>
            <dt><b>{{ $t('imya-i-otchestvo') }}</b></dt>
            <dd>{{ $store.state.userprofile.fio }}</dd>
            <dt><b>{{ $t('vklyuchyon-li') }}</b></dt>
            <dd>
              <boolean-icon v-model="$store.state.userprofile.is_active"></boolean-icon>
            </dd>
            <dt><b>{{ $t('superpolzovatel-0') }}</b></dt>
            <dd>
              <boolean-icon v-model="$store.state.userprofile.is_superuser"></boolean-icon>
            </dd>
          </dl>
        </div>
      </div>
      <div class="user-skills user-bio-section">
        <div class="user-bio-section-body">
          <div class="progress-item"><span>{{ $t('uroven-dostupa') }}</span>
            <el-progress :percentage="$store.state.userprofile.access_level" :status="$store.state.userprofile.access_level === 100 ? "success" : undefined"></el-progress>
          </div>
          <div class="progress-item"><span>{{ $t('kakoi-to-drugoi-progress') }}</span>
            <el-progress :percentage="45"></el-progress>
          </div>
          <div class="progress-item"><span>{{ $t('eshyo-chto-to') }}</span>
            <el-progress :percentage="4"></el-progress>
          </div>
          <div class="progress-item"><span>{{ $t('chto-to-zavershyonnoe') }}</span>
            <el-progress :percentage="100" status="success"></el-progress>
          </div>
        </div>
      </div>
    </div>
  </el-card>
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
