<template lang="pug">
  el-form(
    ref="srvfrm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="isLoading")
    el-form-item(:label="$t('title')" prop="title")
      el-input(v-model="frmMod.title")

    el-form-item(:label="$t('description')" prop="descr")
      el-input(v-model="frmMod.descr")

    el-form-item(:label="$t('comeIn.')" prop="speed_in")
      el-input(v-model="frmMod.speed_in" type="number")

    el-form-item(:label="$t('speed.')" prop="speed_out")
      el-input(v-model="frmMod.speed_out" type="number")

    el-form-item(:label="$t('acceleration')" prop="speed_burst")
      el-input(v-model="frmMod.speed_burst" type="number")

    el-form-item(:label="$t('value')" prop="cost")
      el-input(v-model="frmMod.cost" type="number")

    el-form-item(:label="$t('administrative')" prop="is_admin")
      el-checkbox(v-model="frmMod.is_admin")
        | {{ $t('administrativeServices.') }}
        b {{ frmMod.is_admin ? 'Да' : 'Нет' }}

    el-form-item(:label="$t('scream')", prop="calc_type")
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
import i18n from '@/lang'

const speedRule = {
  validator: positiveNumberValueAvailable,
  message: i18n.t('speedShallBePositive'),
  trigger: 'change'
}

@Component({
  name: 'service-form'
})
export default class extends mixins(FormMixin) {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: this.$t('nameShouldBeIndicated'), trigger: 'blur' }
    ],
    descr: [
      { required: true, message: this.$t('descriptionMandatory'), trigger: 'blur' }
    ],
    speed_in: [
      speedRule,
      { required: true, message: this.$t('speedOut'), trigger: 'blur' }
    ],
    speed_out: [
      speedRule,
      { required: true, message: this.$t('speedIn.'), trigger: 'blur' }
    ],
    cost: [
      { required: true, message: this.$t('thePriceShallBeSpecified'), trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: this.$t('cena-dolzhna-byt-polozhitelnoi-ili-0') }
    ]
  }

  private serviceTypeNames = [
    { nm: this.$t('baseCalcFunction'), v: IServiceTypeEnum.BASE },
    { nm: 'IS', v: IServiceTypeEnum.IS },
    { nm: this.$t('eternalService10Years'), v: IServiceTypeEnum.LONG },
    { nm: this.$t('daily'), v: IServiceTypeEnum.DAILY }
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
            this.$message.success(this.$t('serviceEstablished'))
          } else {
            newDat = await ServiceModule.PatchService(this.frmMod)
            this.$message.success(this.$t('serviceChanged'))
          }
          this.$emit('done', newDat)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error(this.$t('fixFormErrs'))
      }
    })
  }

  created() {
    this.frmInitial = Object.assign({}, this.frmMod)
  }
}
</script>
