<template lang="pug">
  el-form(
    ref="form"
    label-width="100px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(
      :label="$t('title')"
      prop="title"
    )
      el-input(v-model="frmMod.title")
  
    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { GroupModule } from '@/store/modules/groups/index'
import { Form } from 'element-ui'

@Component({
  name: 'GroupForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$t('nazvanie-gruppy-nado-ukazat'), trigger: 'blur' }
    ]
  }

  @Watch('$store.state.group.title')
  private onChangeGroup(title: string) {
    this.frmMod.title = title
  }

  private frmMod = {
    title: ''
  }

  get isNew() {
    return GroupModule.id === 0
  }

  created() {
    this.onChangeGroup(this.$store.state.group.title)
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
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
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
