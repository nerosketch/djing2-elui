<template lang="pug">
el-row(:gutter="5")
  el-col.mt5(:lg="12" :sm='24')
    el-card(shadow="never")
      template(v-slot:header)
        .clearfix Каналы оповещений
      el-form
        el-form-item
          el-switch(
            v-model="value1"
            active-text="Уведомлять через Telegram"
          )

        el-form-item
          el-switch(
            v-model="value2"
            active-text="Уведомлять через Viber"
          )
        el-form-item
          el-switch(
            v-model="value2"
            active-text="Уведомлять на почту(Email)"
          )
        el-form-item
          el-switch(
            v-model="value2"
            active-text="Push уведомления"
          )
        el-form-item
          el-switch(
            v-model="value2"
            active-text="Уведомлять звонком (через АТС)"
          )
        el-form-item
          el-switch(
            v-model="value2"
            active-text="Уведомлять через свои способы"
          )

  el-col.mt5(:lg="12" :sm='24')
    el-card(shadow="never")
      template(v-slot:header)
        .clearfix Настройки оповещений
      el-form
        el-form-item
          el-switch(
            v-model="value1"
            active-text="Уведомлять о задачах"
          )

        el-form-item
          el-switch(
            v-model="value2"
            active-text="Уведомлять о событиях устройств"
        )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'MessengerOptions'
})
export default class extends Vue {
  private value1 = true
  private value2 = false
}
</script>
