<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    h2 {{ frmMod }}
    el-form-item(
      label="Нахзвание"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="Тех.код"
      prop='code'
    )
      el-input(v-model="frmMod.code")
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { IGroup } from '@/api/groups/types'
import { latinValidator } from '@/utils/validate'

@Component({
  name: 'group-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название группы надо указать', trigger: 'blur' }
    ],
    code: [
      { max: 12, message: 'Максимум 12 символов для кода', trigger: 'change' },
      { validator: latinValidator, trigger: 'change', message: 'Только латиница' }
    ]
  }

  private frmMod: IGroup = <IGroup>GroupModule.context.state

  private async onSubmit() {
    this.isLoading = true
    GroupModule.ChangeParam({ key: 'title', value: this.frmMod.title })
    GroupModule.ChangeParam({ key: 'code', value: this.frmMod.code })
    const newDat = await GroupModule.SaveGroup()
    this.isLoading = false
    this.$emit('done', newDat)
  }
}
</script>
