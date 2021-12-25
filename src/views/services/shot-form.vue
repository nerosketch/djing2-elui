<template lang="pug">
  el-form(
    ref="shotfrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')", prop="name")
      el-input(v-model="frmMod.name")
  
    el-form-item(:label="$t('value')", prop="cost")
      el-input(v-model="frmMod.cost")
  
    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { positiveValidator } from '@/utils/validate'
import { OneShotPayModule } from '@/store/modules/services/one-shot-pay'

@Component({
  name: 'shot-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    name: [
      { required: true, message: this.$t('nameShouldBeIndicated'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: this.$t('thePriceShouldBeSpecified'), trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: this.$t('cena-dolzhna-byt-polozhitelnoi-ili-0') }
    ]
  }

  private frmMod = {
    name: OneShotPayModule.name,
    cost: OneShotPayModule.cost
  }

  private onSubmit() {
    (this.$refs.shotfrm as Form).validate(async valid => {
      if (valid) {
        try {
          this.isLoading = true
          let newDat
          if (this.isNew) {
            newDat = await OneShotPayModule.AddOneShotPay(this.frmMod)
          } else {
            newDat = await OneShotPayModule.PatchOneShotPay(this.frmMod)
          }
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }

  get isNew(): boolean {
    return OneShotPayModule.id === 0
  }
}
</script>
