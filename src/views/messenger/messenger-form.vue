<template lang="pug">
  el-form(
    ref="form"
    label-width="115px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(
      :label="$t('title')"
      prop="title"
    )
      el-input(v-model="frmMod.title")

    el-form-item(
      :label="$t('description')"
      prop="description"
    )
      el-input(v-model="frmMod.description")

    el-form-item(
      :label="$t('typeOfBean')"
      prop="bot_type"
    )
      el-select(
        v-model="frmMod.bot_type"
        :loading="messengerTypesLoading"
      )
        el-option(
          v-for="mbt in messengerBotTypes"
          :key="mbt.val"
          :value="mbt.val"
          :label="mbt.text")

    el-form-item(
      :label="$t('token')"
      prop="token"
    )
      el-input(v-model="frmMod.token")

    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { IMessenger } from '@/api/messenger/types'
import { mixins } from 'vue-class-component'
import BotTypesMixin from './bot_types_mixin'
import i18n from '@/lang'

const tx = i18n.tc('iNeedToKnowWhatApiWillBeWorkingWith')

@Component({
  name: 'MessengerForm'
})
export default class extends mixins(BotTypesMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$tc('nameForMassengerShouldBeIndicated'), trigger: 'blur' }
    ],
    token: this.isNew
      ? [
          { required: true, message: this.$tc('messengerTokenShouldBeIndicated'), trigger: 'blur' }
        ]
      : [],
    bot_type: [
      { validator: positiveNumberValueAvailable, trigger: 'change', message: tx },
      { required: true, message: tx, trigger: 'blur' }
    ]
  }

  private frmMod = {
    title: '',
    description: '',
    bot_type: 0,
    token: undefined
  }

  created() {
    this.onChangeMsg(this.$store.state.messenger)

    if (this.messengerBotTypes.length === 0) {
      this.loadMessengerTypes().then(() => {
        this.messengerBotTypes.unshift({ val: 0, text: this.$tc('notSpecified') })
      })
    }
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          let newDat
          if (this.isNew) {
            const botTypes = this.messengerBotTypes.filter(m => (m.val === this.frmMod.bot_type))
            if (botTypes.length > 0) {
              newDat = await MessengerModule.AddMessenger({
                m: this.frmMod,
                typeName: botTypes[0].text
              })
              this.$message.success(this.$tc('chatbotIsEstablished'))
            } else {
              this.$message.error(this.$tc('chooseTheMassengerType'))
            }
          } else {
            newDat = await MessengerModule.PatchMessenger(this.frmMod)
            this.$message.success(this.$tc('chatBotIsChanged'))
          }
          this.$emit('done', newDat)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs').toString())
      }
    })
  }

  @Watch('$store.state.messenger', { deep: true })
  private onChangeMsg(m: IMessenger) {
    this.frmMod.title = m.title
    this.frmMod.description = m.description
    this.frmMod.bot_type = m.bot_type
  }

  private get isNew() {
    return this.$store.state.messenger.id === 0
  }
}
</script>
