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
      label="Группа"
      prop='group'
    )
      el-select(v-model="frmMod.group")
        el-option(
          v-for="grp in groups"
          :key="grp.pk"
          :label="grp.title"
          :value="grp.pk"
        )
    el-form-item
      el-button(
        type="success" @click="onSubmit"
        :loading="loading"
        :disabled="!$perms.customers.add_customerstreet"
      ) Добавить
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { CustomerStreetModule } from '@/store/modules/customers/street'
import { IGroup } from '@/api/groups/types'
import { getGroups } from '@/api/groups/req'

@Component({
  name: 'NewStreetForm'
})
export default class extends Vue {
  @Prop({ default: 0 }) private groupId!: number
  private loading = false
  private groups: IGroup[] = []

  private frmRules = {
    name: [
      { required: true, message: 'Название улицы надо указать', trigger: 'blur' }
    ]
  }

  private frmMod = {
    name: '',
    group: this.groupId
  }

  private onSubmit() {
    (this.$refs['form'] as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const newDat = await CustomerStreetModule.AddStreet(this.frmMod)
        this.loading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private async loadGroups() {
    this.loading = true
    try {
      const { data } = await getGroups() as any
      this.groups = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loading = false
    }
  }

  created() {
    this.loadGroups()
  }
}
</script>
