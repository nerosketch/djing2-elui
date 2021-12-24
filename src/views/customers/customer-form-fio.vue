<template lang="pug">
  el-collapse(v-model="collapse")
    el-collapse-item
      template(slot="title")
        el-form-item(:label="$t('customers.fio')", style="margin-bottom: 0")
          b
            | {{ origValue }}
    
      el-form(
        status-icon
        :rules="frmRules"
        :model="frmData"
        :label-width="$store.getters.isMobileView ? undefined : '115px'")
        el-form-item(:label="$t('customers.surname')", prop="surname")
          el-input(v-model="frmData.surname")
      
        el-form-item(:label="$t('customers.name')", prop="firstName")
          el-input(v-model="frmData.firstName")
      
        el-form-item(:label="$t('customers.lastName')", prop="lastName")
          el-input(v-model="frmData.lastName")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import i18n from '@/lang'
import { regexpVal } from '@/utils/validate'

const nameValidator = regexpVal(/^[A-Za-zА-Яа-яЁё-]{1,250}$/i)
const errText = i18n.t('customers.formValidatorErrText').toString()

@Component({
  name: 'CustomerFormFio'
})
export default class extends Vue {
  @Prop({ default: '' })
  private value!: string

  private collapse = []

  private origValue = this.value

  private frmData = {
    firstName: '',
    lastName: '',
    surname: ''
  }

  private frmRules = {
    firstName: [
      {
        required: true,
        message: this.$t('customers.nameRequiredValidatorErrText'),
        trigger: 'blur'
      },
      { validator: nameValidator, trigger: 'change', message: errText }
    ],
    lastName: [
      { validator: nameValidator, trigger: 'change', message: errText }
    ],
    surname: [
      {
        required: true,
        message: this.$t('customers.surnameRequiredValidatorErrText'),
        trigger: 'blur'
      },
      { validator: nameValidator, trigger: 'change', message: errText }
    ]
  }

  /* private get fioGetter() {
    const fm = this.frmData
    const r = `${fm.surname} ${fm.firstName} ${fm.lastName}`
    this.$emit('input', r)
    return r
  } */

  @Watch('$store.state.customer.fio')
  private onchfio(fio: string) {
    this.origValue = fio
  }

  @Watch('frmData', { deep: true })
  private onChangeFio(frmData: any) {
    const r = `${frmData.surname} ${frmData.firstName} ${frmData.lastName}`
    this.$emit('input', r)
  }

  @Watch('value')
  private onChangeVal(fio: string) {
    this.readFio(fio)
  }

  created() {
    if (this.value) {
      this.readFio(this.value)
    }
  }

  private readFio(fullName: string) {
    const r = fullName.split(' ')
    if (r.length >= 3) {
      this.frmData.surname = r[0]
      this.frmData.firstName = r[1]
      this.frmData.lastName = r[2]
    } else if (r.length == 2) {
      this.frmData.surname = r[0]
      this.frmData.firstName = r[1]
      this.frmData.lastName = ''
    } else {
      this.frmData.surname = fullName
    }
  }
}
</script>
