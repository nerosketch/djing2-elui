<template lang="pug">
  el-form(
    ref="srvfrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')", prop="title")
      el-input(v-model="frmMod.title")
  
    el-form-item(label="$t('opisanie-10')", prop="descr")
      el-input(v-model="frmMod.descr")
  
    el-form-item(label="$t('vkhod-skorost')", prop="speed_in")
      el-input(v-model="frmMod.speed_in", type="number")
  
    el-form-item(label="$t('iskhod-skorost')", prop="speed_out")
      el-input(v-model="frmMod.speed_out", type="number")
  
    el-form-item(label="$t('uskorenie')", prop="speed_burst")
      el-input(v-model="frmMod.speed_burst", type="number")
  
    el-form-item(label="$t('stoimost-1')", prop="cost")
      el-input(v-model="frmMod.cost", type="number")
  
    el-form-item(label="$t('administrativnaya')", prop="is_admin")
      el-checkbox(v-model="frmMod.is_admin")
        | {{ $t('yavlyaetsya-li-administrativnoi-uslugoi') }}
      
        b
          | {{ frmMod.is_admin ? 'Да' : 'Нет' }}
  
    el-form-item(label="$t('skript')", prop="calc_type")
      el-select(v-model="frmMod.calc_type")
        el-option(
          v-for="dt in serviceTypeNames"
          :key="dt.v"
          :label="dt.nm"
          :value="dt.v")
  
    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isFormUntouched")
        | {{ $t('save') }}
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import { positiveValidator, positiveNumberValueAvailable } from '@/utils/validate'
import { IServiceTypeEnum } from '@/api/services/types'
import { ServiceModule } from '@/store/modules/services/service'
import FormMixin from '@/utils/forms'

const speedRule = {
  validator: positiveNumberValueAvailable,
  message: this.$t('skorost-dolzhna-byt-polozhitelnoi'),
  trigger: 'change'
}

@Component({
  name: 'service-form'
})
export default class extends mixins(FormMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$t('nazvanie-nado-ukazat-1'), trigger: 'blur' }
    ],
    descr: [
      { required: true, message: this.$t('opisanie-obyazatelno'), trigger: 'blur' }
    ],
    speed_in: [
      speedRule,
      { required: true, message: this.$t('ukazhi-iskhodyashuyu-skorost'), trigger: 'blur' }
    ],
    speed_out: [
      speedRule,
      { required: true, message: this.$t('ukazhi-vkhodyashuyu-skorost'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: this.$t('cena-dolzhna-byt-ukazana'), trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: this.$t('cena-dolzhna-byt-polozhitelnoi-ili-0-0') }
    ]
  }

  private serviceTypeNames = [
    { nm: this.$t('bazovyi-raschyotnyi-funkcional'), v: IServiceTypeEnum.BASE },
    { nm: 'IS', v: IServiceTypeEnum.IS },
    { nm: this.$t('vechnaya-usluga-10-let'), v: IServiceTypeEnum.LONG },
    { nm: this.$t('sutochnaya'), v: IServiceTypeEnum.DAILY }
  ]

  private frmMod = {
    title: ServiceModule.title,
    descr: ServiceModule.descr,
    speed_in: ServiceModule.speed_in,
    speed_out: ServiceModule.speed_out,
    speed_burst: ServiceModule.speed_burst,
    cost: ServiceModule.cost,
    is_admin: ServiceModule.is_admin,
    calc_type: ServiceModule.calc_type
  }

  @Watch('$store.state.service.id')
  private async onSrvCh() {
    this.frmMod = {
      title: ServiceModule.title,
      descr: ServiceModule.descr,
      speed_in: ServiceModule.speed_in,
      speed_out: ServiceModule.speed_out,
      speed_burst: ServiceModule.speed_burst,
      cost: ServiceModule.cost,
      is_admin: ServiceModule.is_admin,
      calc_type: ServiceModule.calc_type
    }
    this.frmInitial = Object.assign({}, this.frmMod)
  }

  private onSubmit() {
    (this.$refs.srvfrm as Form).validate(async valid => {
      if (valid) {
        try {
          this.isLoading = true
          let newDat
          if (ServiceModule.id === 0) {
            newDat = await ServiceModule.AddService(this.frmMod)
            this.$message.success(this.$t('usluga-sozdana'))
          } else {
            newDat = await ServiceModule.PatchService(this.frmMod)
            this.$message.success(this.$t('usluga-izmenena'))
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

  created() {
    this.frmInitial = Object.assign({}, this.frmMod)
  }
}
</script>
