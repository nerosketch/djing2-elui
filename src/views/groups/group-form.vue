<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
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
import { Component, Vue, Watch } from 'vue-property-decorator'
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

  get onChId() {
    return GroupModule.pk
  }
  @Watch('onChId')
  private onChangeGroup() {
    this.frmMod.title = GroupModule.title
    this.frmMod.code = GroupModule.code
  }

  private frmMod = {
    title: '',
    code: ''
  }
  get isNew() {
    return GroupModule.pk === 0
  }

  created() {
    this.frmMod.title = GroupModule.title
    this.frmMod.code = GroupModule.code
  }

  private async onSubmit() {
    this.isLoading = true
    let newDat
    if (this.isNew) {
      newDat = await GroupModule.AddGroup(this.frmMod)
    } else {
      newDat = await GroupModule.PatchGroup(this.frmMod)
    }
    this.isLoading = false
    this.$emit('done', newDat)
  }
}
</script>
