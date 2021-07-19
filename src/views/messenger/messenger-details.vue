<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col.mt5(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Подробности бота "{{ $store.state.messenger.title }}"
        messenger-form(v-if='isReady')
    el-col.mt5(:lg='12' :sm='24')
      b Текущий webhook url: 
      span {{ $store.state.messenger.title }}
      el-button-group
        el-button(
          @click="setWebhook"
          size='mini'
          :loading='setWebhookLoading'
        ) Отправить webhook url
        el-button(
          @click="stopWebhook"
          size='mini'
          :loading='stopWebhookLoading'
        ) Остановить webhook
</template>

<script lang="ts">
import { messengerSendWebHook, messengerStopWebHook } from '@/api/messenger/req'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { Component, Vue, Prop } from 'vue-property-decorator'
import MessengerForm from './messenger-form.vue'

@Component({
  name: 'MessengerDetails',
  components: {
    MessengerForm
  }
})
export default class extends Vue {
  @Prop({ required: true }) private mId!: number
  private isReady = false
  private setWebhookLoading = false
  private stopWebhookLoading = false

  created() {
    this.loadMsg()
  }

  private async loadMsg() {
    try{
      await MessengerModule.GetMessenger(this.mId)
      this.isReady = true
    } catch (err) {
      this.isReady = false
      this.$message.error(err)
    }
  }

  private async setWebhook() {
    this.setWebhookLoading = true
    try {
      await messengerSendWebHook(this.mId)
    } finally {
      this.setWebhookLoading = false
    }
  }

  private async stopWebhook() {
    this.stopWebhookLoading = true
    try {
      await messengerStopWebHook(this.mId)
    } finally {
      this.stopWebhookLoading = false
    }
  }
}
</script>
