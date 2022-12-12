<template lang="pug">
  el-form(
    ref="frm"
    status-icon
    :rules="frmRules"
    :model="frmMod"
    v-loading="loading")
    el-form-item(:label="$t('customers.contractNum.s')" prop="username")
      el-input(v-model="frmMod.username")

    el-form-item(:label="$t('title')" prop="title")
      el-input(v-model="frmMod.title")

    el-form-item(:label="$t('fioDirector')" prop="fio")
      el-input(v-model="frmMod.fio")

    el-form-item(:label="$t('group')")
      groups-choice(v-model="frmMod.group_id")

    el-form-item(:label="$t('typeOfLegal')" prop="legal_type")
      legal-type-choice(v-model="frmMod.legal_type")

    el-form-item(:label="$t('legalAddress')" prop="address_id")
      addr-field-input(v-model="frmMod.address_id")

    el-form-item(:label="$t('postalLegalAddressIndex')" prop="post_index")
      el-input(v-model="frmMod.post_index")

    el-form-item(:label="$t('accountDeliveryAddress')")
      addr-field-input(v-model="frmMod.delivery_address_id")

    el-form-item(:label="$t('postalAccountDeliveryAddressIndex')" prop="delivery_address_post_index")
      el-input(v-model="frmMod.delivery_address_post_index")
        el-button(
          slot="append"
          @click="copyDeliveryAddrFromLegalAddr"
          icon="el-icon-document-copy"
          :title="$t('copyTheAddressFromTheLegalAddress')"
          :disabled="addrCopyDisabled")

    el-form-item(:label="$t('postalAddress')")
      addr-field-input(v-model="frmMod.post_address_id")

    el-form-item(:label="$t('postalAddressIndex')" prop="post_post_index")
      el-input(v-model="frmMod.post_post_index")
        el-button(
          slot="append"
          @click="copyPostAddrFromLegalAddr"
          icon="el-icon-document-copy"
          :title="$t('copyTheAddressFromTheLegalAddress')"
          :disabled="addrCopyDisabled")

    el-form-item(:label="$t('inn')" prop="tax_number")
      el-input(v-model="frmMod.tax_number" type="number")

    el-form-item(label="ОГРН" prop="state_level_reg_number")
      el-input(v-model="frmMod.state_level_reg_number" type="number")

    el-form-item(:label="$t('contractDocs.dateBegin')" prop="actual_start_time")
      el-date-picker(
        v-model="frmMod.actual_start_time"
        type="date"
        value-format="yyyy-MM-dd HH:mm"
        format="d.MM.yyyy")

    el-form-item(:label="$t('description')")
      el-input(
        type="textarea"
        rows="5"
        v-model="frmMod.description")

    el-form-item
      el-button(
        icon="el-icon-upload"
        :type="isNew ? 'success' : 'primary'"
        @click="onSubmit"
        :disabled="!$perms.customers_legal.add_customerlegalmodel")
        | {{ isNew ? 'Добавить' : 'Сохранить' }}
</template>

<script lang="ts">
import { latinValidator, positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'
import { ICustomerLegal } from '@/api/customers_legal/types'
import LegalTypeChoice from '@/components/CustomerLegal/legal-type-choice.vue'
import i18n from '@/lang'

const maxLenValidator = { max: 6, trigger: 'change', message: i18n.t('thePostalIndexContainsNotMoreThan6Symbols') }

@Component({
  name: 'LegalForm',
  components: {
    GroupsChoice,
    AddrFieldInput,
    LegalTypeChoice
  }
})
export default class extends Vue {
  public readonly $refs!: {
    frm: Form
  }

  private loading = false

  private frmMod: {
    username: string,
    title: string,
    fio: string,
    description: string,
    group_id: number | null,
    address_id: number,
    post_index: string,
    delivery_address_id: number | null,
    delivery_address_post_index: string,
    post_post_index: string,
    post_address_id: number | null,
    legal_type: number,
    tax_number: string,
    state_level_reg_number: string,
    actual_start_time: string,
  } = {
    username: '',
    title: '',
    fio: '',
    description: '',
    group_id: null,
    address_id: 0,
    post_index: '',
    delivery_address_id: null,
    delivery_address_post_index: '',
    post_post_index: '',
    post_address_id: null,
    legal_type: 0,
    tax_number: '',
    state_level_reg_number: '',
    actual_start_time: ''
  }

  @Watch('$store.state.customerlegal', { deep: true })
  private onUpdateStore(profile: ICustomerLegal) {
    this.fillFrmMod(profile)
  }

  private fillFrmMod(profile: ICustomerLegal) {
    this.frmMod.username = profile.username
    this.frmMod.title = profile.title
    this.frmMod.fio = profile.fio
    this.frmMod.description = profile.description
    this.frmMod.group_id = profile.group_id || null
    this.frmMod.address_id = profile.address_id
    this.frmMod.post_index = profile.post_index
    this.frmMod.delivery_address_id = profile.delivery_address_id
    this.frmMod.delivery_address_post_index = profile.delivery_address_post_index
    this.frmMod.post_post_index = profile.post_post_index
    this.frmMod.post_address_id = profile.post_address_id
    this.frmMod.legal_type = profile.legal_type
    this.frmMod.tax_number = profile.tax_number
    this.frmMod.state_level_reg_number = profile.state_level_reg_number
    this.frmMod.actual_start_time = profile.actual_start_time
  }

  private frmRules = {
    username: [
      { required: true, message: this.$tc('customers.contractNum.required'), trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: this.$tc('contractCanContainLatinAndDigits') }
    ],
    post_index: [
      maxLenValidator
    ],
    delivery_address_post_index: [
      maxLenValidator
    ],
    post_post_index: [
      maxLenValidator
    ],
    title: [
      { required: true, message: this.$tc('nameToBeIndicated'), trigger: 'blur' }
    ],
    fio: [
      { required: true, message: this.$tc('directorSFioIsRequired'), trigger: 'blur' }
    ],
    tax_number: [
      { required: true, message: this.$tc('insNeedsToBeFilled'), trigger: 'blur' }
    ],
    address_id: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$tc('weNeedALegalAddress') }
    ],
    state_level_reg_number: [
      { required: true, message: this.$tc('iWill'), trigger: 'blur' }
    ],
    legal_type: [
      { required: true, message: this.$tc('theTypeOfLawnIsMandatory'), trigger: 'blur' },
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: this.$tc('weNeedToSelectTheRightTypeOfJuriqueFromTheListOfValues') }
    ],
    actual_start_time: [
      { required: true, trigger: 'change' }
    ]
  }

  private get isNew() {
    return !this.$store.state.customerlegal.id
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNew) {
            const newAccount = await CustomerLegalModule.addCustomerLegal(this.frmMod)
            this.$message.success(`Учётная запись "${newAccount.title}" успешно создана`)
            this.$emit('added', newAccount)
          } else {
            const patchedAccount = await CustomerLegalModule.updateCustomerLegal(this.frmMod)
            this.$message.success(`Учётная запись "${patchedAccount.title}" успешно обновлена`)
            this.$emit('update', patchedAccount)
          }
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error(this.$tc('correctFormsOfError'))
      }
    })
  }

  created() {
    this.fillFrmMod(this.$store.state.customerlegal)
  }

  private copyDeliveryAddrFromLegalAddr() {
    if (this.addrCopyDisabled) return
    this.frmMod.delivery_address_id = this.frmMod.address_id
    this.frmMod.delivery_address_post_index = this.frmMod.post_index
  }

  private copyPostAddrFromLegalAddr() {
    if (this.addrCopyDisabled) return
    this.frmMod.post_address_id = this.frmMod.address_id
    this.frmMod.post_post_index = this.frmMod.post_index
  }

  get addrCopyDisabled() {
    return !this.frmMod.address_id || !this.frmMod.post_index
  }
}
</script>
