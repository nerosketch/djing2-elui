<template lang="pug">
  el-row.app-container(:gutter="5")
    el-col(:lg="12" :sm="24")
      el-card
        template(v-slot:header) {{ $t('bottomDetails') }} "{{ $store.state.messenger.title }}"

        messenger-form(v-if="isReady")

    el-col(:lg="12" :sm="24")
      el-card
        template(v-slot:header) {{ $t('currentWebHook') }} {{ $store.state.messenger.current_webhook }}

        el-button-group.mt5.mb5
          el-button(
            @click="setWebhook" :loading="setWebhookLoading"
          ) {{ $t('sendWebHoseUrn') }}

          el-button(
            @click="stopWebhook" :loading="stopWebhookLoading"
          ) {{ $t('stopTheWebSite') }}
</template>

<script lang="ts">
import { messengerSendWebHook, messengerStopWebHook } from '@/api/messenger/req'
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
    try {
      const msg = await MessengerModule.GetMessenger({
        mId: this.mId,
        typeName: this.messengerTypeName
      })
      this.isReady = true
      this.onMessengerIdCh(msg)
    } catch {
      this.isReady = false
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
          title: this.$tc('messengers')
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
    ] as any)
  }
}
</script>
