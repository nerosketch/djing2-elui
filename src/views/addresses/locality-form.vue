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
import { Form } from 'element-ui'
import { LocalityModule } from '@/store/modules/addresses/locality'

@Component({
  name: 'LocalityForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ]
  }

  @Watch('$store.state.locality.title')
  private onChangeLoc(title: string) {
    this.frmMod.title = title
  }

  private frmMod = {
    title: ''
  }
  get isNew() {
    return this.$store.state.locality.id === 0
  }

  created() {
    this.onChangeLoc(this.$store.state.locality.title)
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNew) {
          newDat = await LocalityModule.AddLocality(this.frmMod)
        } else {
          newDat = await LocalityModule.PatchLocality(this.frmMod)
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
