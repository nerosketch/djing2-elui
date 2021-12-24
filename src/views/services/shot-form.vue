<template>
  <el-form ref="shotfrm" status-icon :rules="frmRules" :model="frmMod" v-loading="isLoading">
    <el-form-item :label="$t('title')" prop="name">
      <el-input v-model="frmMod.name"></el-input>
    </el-form-item>
    <el-form-item label="$t('stoimost-2')" prop="cost">
      <el-input v-model="frmMod.cost"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="isLoading">{{ $t('save') }}</el-button>
    </el-form-item>
  </el-form>
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
      { required: true, message: this.$t('nazvanie-nado-ukazat-2'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: this.$t('cenu-nado-ukazat-0'), trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: this.$t('cena-dolzhna-byt-polozhitelnoi-ili-0-1') }
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
