<template lang="pug">
  el-form(
    ref='form'
    label-width="100px"
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
    el-form-item
      el-button(
        icon='el-icon-upload'
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { Form } from 'element-ui'

@Component({
  name: 'group-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название группы надо указать', trigger: 'blur' }
    ]
  }

  @Watch('$store.state.group.id')
  private onChangeGroup() {
    this.frmMod.title = GroupModule.title
  }

  private frmMod = {
    title: ''
  }
  get isNew() {
    return GroupModule.id === 0
  }

  created() {
    this.onChangeGroup()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNew) {
          newDat = await GroupModule.AddGroup(this.frmMod)
        } else {
          newDat = await GroupModule.PatchGroup(this.frmMod)
        }
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
