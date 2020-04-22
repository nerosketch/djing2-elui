<template lang="pug">
  el-form(
    ref='srvfrm'
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
    el-form-item(
      label="Описание"
      prop='descr'
    )
      el-input(v-model="frmMod.descr")
    el-form-item(
      label="Вход. скорость"
      prop='speed_in'
    )
      el-input(v-model="frmMod.speed_in")
    el-form-item(
      label="Исход. скорость"
      prop='speed_out'
    )
      el-input(v-model="frmMod.speed_out")
    el-form-item(
      label="Ускорение"
      prop='speed_burst'
    )
      el-input(v-model="frmMod.speed_burst")
    el-form-item(
      label="Стоимость"
      prop='cost'
    )
      el-input(v-model="frmMod.cost")
    el-form-item(
      label="Административная"
      prop='is_admin'
    )
      el-checkbox(v-model="frmMod.is_admin") Является-ли административной услугой.
        b {{ frmMod.is_admin ? 'Да' : 'Нет' }}
    el-form-item(
      label="Скрипт"
      prop='calc_type'
    )
      el-select(v-model="frmMod.calc_type")
        el-option(
          v-for="dt in serviceTypeNames"
          :key="dt.v"
          :label="dt.nm"
          :value="dt.v"
        )

    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { positiveValidator } from '@/utils/validate'
import { IService, IServiceTypeEnum } from '@/api/services/types'
import { ServiceModule } from '@/store/modules/services/service'

@Component({
  name: 'service-form'
})
export default class extends Vue {
  private isLoading = false

  private frmRules = {
    title: [
      { required: true, message: 'Название надо указать', trigger: 'blur' }
    ],
    speed_in: [
      { required: true, message: 'Укажи исходящую скорость', trigger: 'blur' }
    ],
    speed_out: [
      { required: true, message: 'Укажи входящую скорость', trigger: 'blur' }
    ],
    cost: [
      { required: true, message: 'Цена должна быть указана', trigger: 'blur' },
      { validator: positiveValidator, trigger: 'change', message: 'Цена должна быть положительной или 0' }
    ]
  }

  private serviceTypeNames = [
    { nm: 'Базовый расчётный функционал', v: IServiceTypeEnum.BASE },
    { nm: 'IS', v: IServiceTypeEnum.IS },
    { nm: '"Вечная" услуга (10 лет)', v: IServiceTypeEnum.LONG },
    { nm: 'Суточная', v: IServiceTypeEnum.DAILY }
  ]

  private frmMod = {
    title: ServiceModule.title,
    descr: ServiceModule.descr,
    speed_in: ServiceModule.speed_in,
    speed_out: ServiceModule.speed_out,
    speed_burst: ServiceModule.speed_burst,
    cost: ServiceModule.cost
  }

  private onSubmit() {
    (this.$refs['srvfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        const newDat = await ServiceModule.PatchService(this.frmMod)
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
