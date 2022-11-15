<template lang="pug">
  el-form(
    ref="form"
    label-width="100px"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')" prop="title")
      el-input(v-model="frmMod.title")

    el-form-item(:label="$t('slug')" prop="slug")
      el-input(v-model="frmMod.slug")

    el-form-item
      el-button(
        icon="el-icon-upload"
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="!$perms.fin_app.change_basepaymentmodel")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { IPayRNCBGateway } from '@/api/fin/types'
import { addRNCBPayGateway, changeRNCBPayGateway, getRNCBPayGateway } from '@/api/fin/req'

@Component({
  name: 'RncbGwForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$tc('nameOfGroup'), trigger: 'blur' },
      { max: 64, trigger: 'change' }
    ],
    slug: [
      { required: true, message: this.$tc('iLlBeSure'), trigger: 'blur' },
      { max: 32, message: this.$tc('only32Symbols'), trigger: 'change' }
    ]
  }

  private changeGw(dat: IPayRNCBGateway) {
    this.frmMod.title = dat.title
    this.frmMod.slug = dat.slug
  }

  private frmMod = {
    title: '',
    slug: ''
  }

  get isNew() {
    return this.$store.state.basepaymentmodel.id === 0
  }

  private async fetchGw() {
    if (!this.isNew) {
      const { data } = await getRNCBPayGateway(this.$store.state.basepaymentmodel.id)
      this.changeGw(data)
    }
  }

  created() {
    this.fetchGw()
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        try {
          if (this.isNew) {
            newDat = await addRNCBPayGateway(this.frmMod)
          } else {
            newDat = await changeRNCBPayGateway(
              this.$store.state.basepaymentmodel.id,
              this.frmMod
            )
          }
          this.isLoading = false
          this.$emit('done', newDat)
        } catch {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$tc('fixFormErrs'))
      }
    })
  }
}
</script>
