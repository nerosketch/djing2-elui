<template>  
  <el-form ref="form" label-width="100px" status-icon :rules="frmRules" :model="frmMod" v-loading="isLoading">
    <el-form-item :label="$t('title')" prop="title">
      <el-input v-model="frmMod.title"></el-input>
    </el-form-item>
    <el-form-item label="Service ID" prop="service_id">
      <el-input v-model="frmMod.service_id"></el-input>
    </el-form-item>
    <el-form-item label="Slug" prop="slug">
      <el-input v-model="frmMod.slug"></el-input>
    </el-form-item>
    <el-form-item label="Secret" prop="secret">
      <el-input v-model="frmMod.secret"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-upload" type="primary" @click="onSubmit" :loading="isLoading" :disabled="!$perms.fin_app.change_payalltimegateway">{{ $t('save') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { PayAllTimeGatewayModule } from '@/store/modules/fin/index'
import { Form } from 'element-ui'

@Component({
  name: 'PayGwForm'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название группы надо указать', trigger: 'blur' },
      { max: 64, trigger: 'change' }
    ],
    service_id: [
      { required: true, message: 'Service ID обязательно', trigger: 'blur' },
      { max: 64, trigger: 'change' }
    ],
    slug: [
      { required: true, message: 'Service ID обязательно', trigger: 'blur' },
      { max: 32, message: 'Максимум 32 символа для slug', trigger: 'change' }
    ]
  }

  @Watch('$store.state.payalltimegateway.id')
  private onChangeGw() {
    this.frmMod.title = PayAllTimeGatewayModule.title
    this.frmMod.service_id = PayAllTimeGatewayModule.service_id
    this.frmMod.slug = PayAllTimeGatewayModule.slug
    this.frmMod.secret = PayAllTimeGatewayModule.secret
  }

  private frmMod = {
    title: '',
    service_id: '',
    slug: '',
    secret: ''
  }

  get isNew() {
    return PayAllTimeGatewayModule.id === 0
  }

  created() {
    this.onChangeGw()
  }

  private onSubmit() {
    (this.$refs.form as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        try {
          if (this.isNew) {
            newDat = await PayAllTimeGatewayModule.AddPayGw(this.frmMod)
          } else {
            newDat = await PayAllTimeGatewayModule.PatchPayGw(this.frmMod)
          }
          this.isLoading = false
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs').toString())
      }
    })
  }
}
</script>
