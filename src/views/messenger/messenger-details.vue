<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col.mt5(:lg="12" :sm='24')
      el-card(shadow="never")
        template(v-slot:header)
          .clearfix Подробности бота "{{ $store.state.messenger.title }}"
        messenger-form(v-if='isReady')
    el-col.mt5(:lg='12' :sm='24')
      div
        b Текущий webhook url: 
        span {{ $store.state.messenger.current_webhook }}
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
import { RouteRecord } from 'vue-router'
import { IMessenger } from '@/api/messenger/types'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import MessengerForm from './messenger-form.vue'

@Component({
  name: 'MessengerDetails',
  components: {
    MessengerForm
  }
})
export default class extends Vue {
  @Prop({ required: true })
  private mId!: number

  @Prop({ required: true })
  private messengerTypeName!: string

  private isReady = false
  private setWebhookLoading = false
  private stopWebhookLoading = false

  created() {
    this.loadMsg()
  }

  private async loadMsg() {
    this.isReady = false
    try{
      const msg = await MessengerModule.GetMessenger({
        mId: this.mId,
        typeName: this.messengerTypeName
      })
      this.isReady = true
      this.onMessengerIdCh(msg)
    } catch (err) {
      this.isReady = false
      this.$message.error(err)
    }
  }

  private async setWebhook() {
    this.setWebhookLoading = true
    try {
      await messengerSendWebHook(this.messengerTypeName, this.mId)
    } finally {
      this.setWebhookLoading = false
    }
  }

  private async stopWebhook() {
    this.stopWebhookLoading = true
    try {
      await messengerStopWebHook(this.messengerTypeName, this.mId)
    } finally {
      this.stopWebhookLoading = false
    }
  }

  @Watch('$store.state.messenger', { deep: true })
  private onMessengerIdCh(msg: IMessenger) {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/messenger',
        meta: {
          hidden: true,
          title: 'Мессенджеры'
        }
      },
      {
        path: `/messenger/${this.messengerTypeName}`,
        meta: {
          hidden: true,
          title: this.messengerTypeName
        }
      },
      {
        path: '',
        meta: {
          hidden: true,
          title: msg.title
        }
      }
    ] as RouteRecord[])
  }
}
</script>