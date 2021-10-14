<template lang="pug">
el-form(
  ref='frm'
  status-icon
  :rules="frmRules"
  :model="frmMod"
  v-loading='loading'
)
  el-form-item(
    label="Номер договора"
    prop='username'
  )
    el-input(
      v-model="frmMod.username"
    )
  el-form-item(
    label="Название"
    prop='title'
  )
    el-input(
      v-model="frmMod.title"
    )
  el-form-item(
    label="Фио директора"
    prop='fio'
  )
    el-input(v-model='frmMod.fio')
  el-form-item(
    label="Группа"
  )
    groups-choice(
      v-model='frmMod.group'
    )
  el-form-item(
    label="Юридический адрес"
    prop='address'
  )
    addr-field-input(v-model="frmMod.address")
  el-form-item(
    label="ИНН"
    prop='tax_number'
  )
    el-input(
      v-model="frmMod.tax_number"
      type='number'
    )
  el-form-item(
    label="Почтовый индекс юридического адреса"
  )
    el-input(v-model="frmMod.post_index")
  el-form-item(
    label="Дата начала действия договора"
  )
    el-date-picker(
      v-model="frmMod.actual_start_time"
      type="datetime"
      value-format="yyyy-MM-dd HH:mm:ss"
      format="d.MM.yyyy HH:mm:ss"
      @change="stopTimer"
    )
  el-form-item(
    label="Дата прекращения действия договора"
  )
    el-date-picker(
      v-model="frmMod.actual_end_time"
      value-format="yyyy-MM-dd"
      format="d.MM.yyyy"
    )

  el-form-item(
    label='Описание'
  )
    el-input(
      type='textarea'
      rows='5'
      v-model="frmMod.description"
    )
  el-form-item
    el-button(
      icon='el-icon-upload'
      :type="isNew ? 'success' : 'primary'"
      @click="onSubmit"
      :disabled="!$perms.customers_legal.add_customerlegalmodel"
    ) {{ isNew ? 'Добавить' : 'Сохранить' }}

</template>

<script lang="ts">
import { latinValidator, positiveNumberValueAvailable } from '@/utils/validate'
import { Form } from 'element-ui'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { CustomerLegalModule } from '@/store/modules/customers_legal/customer-legal'
import GroupsChoice from '@/components/Groups/groups-choice.vue'
import AddrFieldInput from '@/components/Address/addr-field-input/index.vue'
import dateCounter from '@/utils/date-counter'
import { ICustomerLegal } from '@/api/customers_legal/types'

@Component({
  name: 'LegalForm',
  components: {
    GroupsChoice,
    AddrFieldInput
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
    group: number | null,
    address: number,
    tax_number: string,
    post_index: string,
    actual_start_time: string,
    actual_end_time: string | null
  } = {
    username: '',
    title: '',
    fio: '',
    description: '',
    group: null,
    address: 0,
    tax_number: '',
    post_index: '',
    actual_start_time: '',
    actual_end_time: null,
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
    this.frmMod.group = profile.group || null
    this.frmMod.address = profile.address
    this.frmMod.tax_number = profile.tax_number
    this.frmMod.post_index = profile.post_index
    this.frmMod.actual_start_time = profile.actual_start_time
    this.frmMod.actual_end_time = profile.actual_end_time
  }

  private frmRules = {
    username: [
      { required: true, message: 'Номер договора обязателен', trigger: 'blur' },
      { validator: latinValidator, trigger: 'change', message: 'Номер договора может содержать латинские символы и цифры' }
    ],
    title: [
      { required: true, message: 'Название нужно указать', trigger: 'blur' },
    ],
    fio: [
      { required: true, message: 'Фио директора обязательно', trigger: 'blur' },
    ],
    tax_number: [
      { required: true, message: 'ИНН нужно заполнить', trigger: 'blur' },
    ],
    address: [
      { required: true, validator: positiveNumberValueAvailable, trigger: 'change', message: 'Нужно указать юридический адрес' }
    ]
  }

  private get isNew() {
    return this.$store.state.customerlegal.id === 0
  }

  private onSubmit() {
    this.$refs.frm.validate(async valid => {
      if (valid) {
        this.loading = true
        try {
          if (this.isNew) {
            const newAccount = await CustomerLegalModule.addCustomerLegal(this.frmMod)
            this.$emit('added', newAccount)
          } else {
            const patchedAccount = await CustomerLegalModule.updateCustomerLegal(this.frmMod)
            this.$emit('update', patchedAccount)
          }
        } finally {
          this.loading = false
        }
      } else {
        this.$message.error('Исправь ошибки формы')
      }
    })
  }

  private localTimer?: NodeJS.Timeout

  created() {
    this.fillFrmMod(this.$store.state.customerlegal)

    if (!this.frmMod.actual_start_time) {
      this.localTimer = dateCounter(this.frmMod, 'actual_start_time', 'YYYY-MM-DD HH:mm:ss')
    }
  }
  private stopTimer() {
    if (this.localTimer) {
      clearInterval(this.localTimer)
    }
  }
  beforeDestroy() {
    this.stopTimer()
  }

}
</script>
