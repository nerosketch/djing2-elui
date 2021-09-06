<template lang="pug">
  el-collapse(v-model="collapse")
    el-collapse-item
      template(slot="title")
        el-form-item(
          label="ФИО"
          style="margin-bottom: 0"
        )
          b {{ fioGetter }}
      el-form(
        status-icon
        :rules='frmRules'
        :model='frmData'
        :label-width="$store.getters.isMobileView ? undefined : '115px'"
      )
        el-form-item(
          label="Фамилия"
          prop="surname"
        )
          el-input(v-model="frmData.surname")
        el-form-item(
          label="Имя"
          prop="firstName"
        )
          el-input(v-model="frmData.firstName")
        el-form-item(
          label="Отчество"
        )
          el-input(v-model="frmData.lastName")

</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { regexpVal } from '@/utils/validate'

const nameValidator = regexpVal(/^[\dA-Za-zА-Яа-яЁё_]{1,250}$/i)
const errText = 'Может содержать только буквы, цифры, и знак _'

@Component({
  name: 'CustomerFormFio'
})
export default class extends Vue {
  @Prop({ default: '' })
  private value!: string

  private collapse = []

  private frmData = {
    firstName: '',
    lastName: '',
    surname: '',
  }

  private frmRules = {
    firstName: [
      { required: true, message: 'Имя обязательно', trigger: 'blur' },
      { validator: nameValidator, trigger: 'change', message: errText }
    ],
    /* lastName: [
      { required: true, message: 'Отчество обязательно', trigger: 'blur' },
      { validator: nameValidator, trigger: 'change', message: errText }
    ], */
    surname: [
      { required: true, message: 'Фамилия обязательна', trigger: 'blur' },
      { validator: nameValidator, trigger: 'change', message: errText }
    ]
  }

  private get fioGetter() {
    const fm = this.frmData
    const r = `${fm.surname} ${fm.firstName} ${fm.lastName}`
    this.$emit('input', r)
    return r
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