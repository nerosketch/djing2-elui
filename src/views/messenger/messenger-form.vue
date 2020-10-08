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
    p frmMod {{ frmMod }}
    el-form-item(
      label="Название"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="Описание"
      prop='description'
    )
      el-text(v-model="frmMod.description")
    el-form-item(
      label="Тех.код"
      prop='bot_type'
    )
      el-select(v-model="frmMod.bot_type")
        el-option(
          v-for="mbt in MessengerBotTypes"
          :key="mbt.val"
          :value="mbt.val"
          :label="mbt.text"
        )
    el-form-item(
      label="название в url"
      prop='slug'
    )
      el-input(v-model="frmMod.slug")
    el-form-item(
      label="название в url"
      prop='slug'
    )
      span Token: {{ $perms.state.messenger.token }}
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading" :disabled="frmMod.bot_type===0") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { latinValidator } from '@/utils/validate'
import { Form } from 'element-ui'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { IMessengerBotType } from '@/api/messenger/types'

@Component({
  name: 'MessengerForm'
})
export default class extends Vue {
  private isLoading = false
  private MessengerBotTypes = [
    { val: 0, text: 'не определено' },
    { val: 1, text: 'Viber' },
    { val: 2, text: 'Telegram' }
  ]

  private frmRules = {
    title: [
      { required: true, message: 'Название для мессенджера надо указать', trigger: 'blur' }
    ],
    slug: [
      { max: 50, message: 'Максимум 50 символов', trigger: 'change' },
      { validator: latinValidator, trigger: 'change', message: 'Только латиница' },
      { required: true, message: 'Название для мессенджера надо указать', trigger: 'blur' }
    ]
  }

  private frmMod = {
    title: '',
    description: '',
    bot_type: IMessengerBotType.UNDEFINED,
    slug: ''
  }

  created() {
    this.frmMod.title = ''
    this.frmMod.bot_type = IMessengerBotType.UNDEFINED
    this.frmMod.slug = ''
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
}
</script>
