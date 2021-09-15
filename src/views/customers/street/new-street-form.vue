<template lang="pug">
  el-form(
    ref='form'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='loading'
  )
    el-form-item(
      label="Название"
      prop='name'
    )
      el-input(v-model="frmMod.name" maxlength='64')
    el-form-item(
      label="Населённый пункт"
    )
      locality-choice(v-model="frmMod.locality")
    el-form-item
      el-button(
        type="success" @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.addresses.add_streetmodel"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { StreetModule } from '@/store/modules/addresses/street'
import LocalityChoice from '@/components/Locality/locality-choice.vue'

@Component({
  name: 'NewStreetForm',
  components: {
    LocalityChoice
  }
})
export default class extends Vue {
  @Prop({ default: 0 }) private localityId!: number
  private loading = false

  private frmRules = {
    name: [
      { required: true, message: 'Название улицы надо указать', trigger: 'blur' }
    ]
  }

  private frmMod = {
    name: '',
    locality: this.localityId
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          const newDat = await StreetModule.AddStreet(this.frmMod)
          this.$emit('done', newDat)
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }
}
</script>
