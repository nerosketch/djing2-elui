<template lang="pug">
  el-form(
    ref='form'
    size="mini"
    label-width="140px"
    status-icon
    :rules='frmRules'
    :model='frmMod'
  )
    el-form-item(
      label="Название"
      prop='title'
    )
      el-input(v-model="frmMod.title")
    el-form-item(
      label="Широта(latitude)"
      prop='latitude'
    )
      el-input(v-model="frmMod.latitude")
    el-form-item(
      label="Долгота(longitude)"
      prop='longitude'
    )
      el-input(v-model="frmMod.longitude")
    el-button(
      icon='el-icon-upload'
      type="primary"
      size='mini'
      @click="onSubmit"
      :loading="isLoading"
    ) Сохранить
</template>

<script lang="ts">
import { Form } from 'element-ui'
import { addMapDot } from '@/api/maps/req'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'DotForm'
})
export default class extends Vue {
  @Prop({ default: 0 })
  private lat!: number

  @Prop({ default: 0 })
  private lon!: number

  private isLoading = false

  private frmMod = {
    title: '',
    latitude: this.lat,
    longitude: this.lon,
    devices: []
  }

  private frmRules = {
    title: [
      { required: true, message: 'Название обязательно', trigger: 'blur' }
    ],
    latitude: [
      { required: true, message: 'Укажите широту', trigger: 'blur' }
    ],
    longitude: [
      { required: true, message: 'Укажите долготу', trigger: 'blur' }
    ]
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        try {
          const { data } = await addMapDot(this.frmMod)
          this.$emit('done', data)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
