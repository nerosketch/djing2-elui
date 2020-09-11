<template lang="pug">
el-card(style='margin-bottom:20px;')
  template(v-slot:header)
    .clearfix
      span Инфо
  .user-profile
    .box-center
      pan-thumb(:image='user.avatar', :height="'100px'", :width="'100px'", :hoverable='false')
        div Прив!
        |           {{ user.roles }}
    .box-center
      .user-name.text-center
        | {{ user.username }}
      .user-role.text-center.text-muted
        | {{ user.fio }}
  .user-bio
    .user-education.user-bio-section
      .user-bio-section-header
        svg-icon(name='education')
          span Education
      .user-bio-section-body
        dl
          dt
            b Телефон
          dd {{ user.telephone }}
          dt
            b Логин
          dd {{ user.username }}
          dt
            b Имя и отчество
          dd {{ user.fio }}
          dt
            b Включён-ли
          dd
            el-checkbox(v-model="user.is_active" disabled)
          dt
            b Суперпользователь
          dd
            el-checkbox(v-model="user.is_superuser" disabled)
    .user-skills.user-bio-section
      .user-bio-section-body
        .progress-item
          span Уровень доступа
          el-progress(
            :percentage='user.access_level'
            :status='user.access_level === 100 ? "success" : ""'
          )
        .progress-item
          span Какой-то другой прогресс
          el-progress(:percentage='45')
        .progress-item
          span ещё что-то
          el-progress(:percentage='4')
        .progress-item
          span Что-то завершённое
          el-progress(:percentage='100', status='success')

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IUserProfile } from '@/api/profiles/types'
import PanThumb from '@/components/PanThumb/index.vue'

@Component({
  name: 'UserCard',
  components: {
    PanThumb
  }
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IUserProfile
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

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
