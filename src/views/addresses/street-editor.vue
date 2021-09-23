<template lang="pug">
  el-form(
    v-loading='streetsLoading'
    label-width="0"
  )
    el-form-item(
      v-for="(str, i) in streets"
      :key="i"
    )
      el-input(v-model="str.title" maxlength='64')
        template(v-slot:append)
          el-button(
            type='danger' icon='el-icon-close'
            @click="delStreet(str)"
            :disabled="!$perms.addresses.delete_addressmodel"
          )
    el-form-item
      el-button-group
        el-button(
          icon='el-icon-upload'
          type="primary" @click="onSubmit"
          :disabled="!$perms.addresses.change_addressmodel"
        ) Сохранить
        el-button(
          icon='el-icon-plus'
          type='success'
          @click='addStreet'
          :disabled="!$perms.addresses.add_addressmodel"
        ) Добавить

</template>

<script lang="ts">
import { addAddress, changeAddress, getAddresses } from '@/api/addresses/req'
import { IAddressEnumTypes, IAddressModel } from '@/api/addresses/types'
import { AddressModule } from '@/store/modules/addresses/address'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  name: 'StreetEditor'
})
export default class extends Vue {
  @Prop({ required: true }) private addrId!: number

  private streetsLoading = false

  private streets: IAddressModel[] = []

  private async loadStreets() {
    this.streetsLoading = true
    try {
      const { data } = await getAddresses({
        page: 1,
        page_size: 0,
        parent_addr: this.addrId,
        address_type: IAddressEnumTypes.STREET,
        fields: 'id,title'
      } as any) as any
      this.streets = data
    } finally {
      this.streetsLoading = false
    }
  }

  created() {
    this.loadStreets()
  }

  @Watch('addrId')
  private onChLocId() {
    this.loadStreets()
  }

  private delStreet(street: IAddressModel) {
    if (street.id > 0) {
      this.$confirm(`Удалить улицу "${street.title}?"`).then(async() => {
        this.streetsLoading = true
        await AddressModule.DelAddress(street.id)
        this.streetsLoading = false
        this.$message.success(`Улица "${street.title} удалена`)
        this.streets = this.streets.filter(s => s.id !== street.id)
      })
    } else {
      const st = this.streets.findIndex(s => s === street)
      if (st > -1) {
        this.streets.splice(st, 1)
      }
    }
  }

  private async onSubmit() {
    this.streetsLoading = true
    for (const st of this.streets) {
      if (st.id > 0) {
        changeAddress(st.id, st)
      } else {
        addAddress(st)
      }
    }
    this.streetsLoading = false
    this.$message.success('Улицы изменены')
    this.$emit('done')
  }

  private addStreet() {
    this.streets.push({
      id: 0,
      title: '',
      address_type: IAddressEnumTypes.STREET,
      parent_addr: this.addrId
    })
  }
}
</script>
