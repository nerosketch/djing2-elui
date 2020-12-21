<template lang="pug">
  el-form(
    ref='form'
    label-width="100px"
    size="mini"
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Название"
      prop='name'
    )
      el-input(v-model="frmMod.name")
    el-form-item(
      label="Домен"
      prop='domain'
    )
      el-input(v-model="frmMod.domain")
    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { SiteModule } from '@/store/modules/sites/index'

@Component({
  name: 'SiteForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    name: [
      { required: true, message: 'Название домена надо указать', trigger: 'blur' }
    ],
    domain: [
      { required: true, message: 'Домен надо указать', trigger: 'blur' }
    ]
  }

  get onChId() {
    return SiteModule.id
  }
  @Watch('onChId')
  private onChangeSite() {
    this.frmMod.name = SiteModule.name
    this.frmMod.domain = SiteModule.domain
  }

  private frmMod = {
    name: '',
    domain: ''
  }
  get isNew() {
    return SiteModule.id === 0
  }

  created() {
    this.onChangeSite()
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNew) {
          newDat = await SiteModule.AddSite(this.frmMod)
          this.$message.success('Домен изменён')
        } else {
          newDat = await SiteModule.PatchSite(this.frmMod)
          this.$message.success('Новый домен создан')
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
