<template lang="pug">
  el-form(
    ref='form'
    label-width="115px"
    size="mini"
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
      label="Тех.код"
      prop='bot_type'
    )
      el-select(v-model="frmMod.bot_type")
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
import { Component, Vue } from 'vue-property-decorator'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { getMessengerTypes } from '@/api/messenger/req'

const tx = 'Нужно знать с каким API будет работать бот'

@Component({
  name: 'MessengerForm'
})
export default class extends Vue {
  private isLoading = false

  private messengerBotTypes: {
    val: number
    text: string
  }[] = []

  private frmRules = {
    title: [
      { required: true, message: 'Название для мессенджера надо указать', trigger: 'blur' }
    ],
    token: [
      { required: true, message: 'Токен для мессенджера надо указать', trigger: 'blur' }
    ],
    bot_type: [
      { validator: positiveNumberValueAvailable, trigger: 'change', message: tx },
      { required: true, message: tx, trigger: 'blur' }
    ]
  }

  private frmMod = {
    title: '',
    description: '',
    bot_type: 0,
    token: ''
  }

  created() {
    this.frmMod.title = ''
    this.frmMod.description = ''
    this.frmMod.bot_type = 0
    this.frmMod.token = ''
    if (this.messengerBotTypes.length === 0) {
      this.loadMessengerTypes()
    }
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          const newDat = await MessengerModule.AddMessenger(this.frmMod)
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

  private async loadMessengerTypes() {
    const { data } = await getMessengerTypes()
    const mt = data.map(m => ({ val: m[0], text: m[1] }))
    mt.unshift({ val: 0, text: 'не определено' })
    this.messengerBotTypes = mt
  }
}
</script>
