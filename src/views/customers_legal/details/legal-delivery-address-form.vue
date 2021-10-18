<template lang="pug">
el-form(
  ref='frm'
  status-icon
  :rules="frmRules"
  :model="frmMod"
  v-loading="loading"
)
  el-form-item(
    label="Адрес доставки счёта"
    prop='address'
  )
    addr-field-input(
      v-model="frmMod.address"
    )
  el-form-item
    el-button(
      icon='el-icon-upload'
      @click="onSubmit"
    ) Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'
import { positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { CustomerLegalDeliveryAddressModule } from '@/store/modules/customers_legal/customer-legal-delivery'

@Component({
  name: 'LegalDeliveryAddressForm',
  components: {
    AddrFieldInput
  }
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod: {
    address: number | null
  } = {
    address: null
  }

  @Watch('$store.state.legaldelivery.address')
  private onChAddr(addrId: number) {
    this.frmMod.address = addrId
  }

  private frmRules = {
    address: [
      { required: true, message: 'Адрес обязателен', trigger: 'blur' },
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно указать юридический адрес' }
    ]
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNew) {
            await CustomerLegalDeliveryAddressModule.addLegalDeliveryAddr(this.frmMod)
          } else {
            await CustomerLegalDeliveryAddressModule.updateLegalDeliveryAddr(this.frmMod)
          }
          this.$message.success('Сохранено')
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private get isNew() {
    return !Boolean(this.$store.state.legaldelivery.id)
  }
}
</script>
