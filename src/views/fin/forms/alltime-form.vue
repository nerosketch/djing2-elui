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

    el-form-item(:label="$t('id')" prop="service_id")
      el-input(v-model="frmMod.service_id")

    el-form-item(:label="$t('slug')" prop="slug")
      el-input(v-model="frmMod.slug")

    el-form-item(:label="$t('secret')" prop="secret")
      el-input(v-model="frmMod.secret")

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
import { addATPayGateway, changeATPayGateway, getATPayGateway } from '@/api/fin/req'
import { IPayAllTimeGateway } from '@/api/fin/types'

@Component({
  name: 'AlltimeGwForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$tc('nameOfGroup'), trigger: 'blur' },
      { max: 64, trigger: 'change' }
    ],
    service_id: [
      { required: true, message: this.$tc('iLlBeSure'), trigger: 'blur' },
      { max: 64, trigger: 'change' }
    ],
    slug: [
      { required: true, message: this.$tc('iLlBeSure'), trigger: 'blur' },
      { max: 32, message: this.$tc('only32Symbols'), trigger: 'change' }
    ]
  }

  private changeGw(dat: IPayAllTimeGateway) {
    this.frmMod.title = dat.title
    this.frmMod.service_id = dat.service_id
    this.frmMod.slug = dat.slug
    this.frmMod.secret = dat.secret
  }

  private frmMod = {
    title: '',
    service_id: '',
    slug: '',
    secret: ''
  }

  get isNew() {
    return this.$store.state.basepaymentmodel.id === 0
  }

  created() {
    this.fetchGw()
  }

  private async fetchGw() {
    if (!this.isNew) {
      const { data } = await getATPayGateway(this.$store.state.basepaymentmodel.id)
      this.changeGw(data)
    }
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        try {
          if (this.isNew) {
            newDat = await addATPayGateway(this.frmMod)
          } else {
            newDat = await changeATPayGateway(
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
