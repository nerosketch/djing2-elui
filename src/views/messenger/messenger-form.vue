<template lang="pug">
  el-form(
    ref='form'
    label-width="115px"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="Описание"
      prop='description'
    )
      el-input(v-model="frmMod.description")
    el-form-item(
      label="Тип бота"
      prop='bot_type'
    )
      el-select(
        v-model="frmMod.bot_type"
        :loading="messengerTypesLoading"
      )
        el-option(
          v-for="mbt in messengerBotTypes"
          :key="mbt.val"
          :value="mbt.val"
          :label="mbt.text"
        )
    el-form-item(
      label="Токен"
      prop='token'
    )
      el-input(v-model="frmMod.token")
    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { IMessenger } from '@/api/messenger/types'
import { mixins } from 'vue-class-component'
import BotTypesMixin from './bot_types_mixin'

const tx = 'Нужно знать с каким API будет работать бот'

@Component({
  name: 'MessengerForm'
})
export default class extends mixins(BotTypesMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название для мессенджера надо указать', trigger: 'blur' }
    ],
    token: this.isNew
      ? [
          { required: true, message: 'Токен для мессенджера надо указать', trigger: 'blur' }
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
        this.messengerBotTypes.unshift({ val: 0, text: 'не определено' })
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
              this.$message.success('Чат бот создан')
            } else {
              this.$message.error('Выбери тип мессенжера')
            }
          } else {
            newDat = await MessengerModule.PatchMessenger(this.frmMod)
            this.$message.success('Чат бот изменён')
          }
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
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
