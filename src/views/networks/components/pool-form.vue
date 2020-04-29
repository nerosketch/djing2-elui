<template lang="pug">
  el-form(
    ref='poolfrm'
    status-icon
    :rules='frmRules'
    :model='frmMod'
    v-loading='isLoading'
  )
    el-form-item(
      label="Подсеть"
      prop='network'
    )
      el-input(v-model="frmMod.network")
    el-form-item(
      label="Описание"
      prop='description'
    )
      el-input(v-model="frmMod.description" type="textarea")
    el-form-item(
      label="Нач. ip"
      prop='ip_start'
    )
      el-input(v-model="frmMod.ip_start")
    el-form-item(
      label="Кон. ip"
      prop='ip_end'
    )
      el-input(v-model="frmMod.ip_end")
    el-form-item(
      label="Группы"
      prop='groups'
    )
      el-select(v-model="frmMod.groups" multiple)
        el-option(
          v-for="g in groups"
          :key="g.pk"
          :label="g.title"
          :value="g.pk"
        )
    el-form-item(
      label="Шлюз"
      prop='gateway'
    )
      el-input(v-model="frmMod.gateway")
    el-form-item(
      label="Метка"
      prop="pool_tag"
    )
      el-input(v-model="frmMod.pool_tag")
    el-form-item(
      label='Динамический'
      prop='is_dynamic'
    )
      el-checkbox(v-model="frmMod.is_dynamic") {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}
    el-form-item
      el-button(type="primary" @click="onSubmit" :loading="isLoading") Сохранить
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { ipAddrValidator, ipAddrMaskValidator, latinValidator } from '@/utils/validate'
import { INetworkIpPool } from '@/api/networks/types'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import { IGroup } from '@/api/groups/types'
import { getGroups } from '@/api/groups/req'

@Component({
  name: 'pool-form'
})
export default class extends Vue {
  private isLoading = false
  private groups: IGroup[] = []

  private frmRules = {
    network: [
      { required: true, message: 'Подсеть надо указать', trigger: 'blur' },
      { validator: ipAddrMaskValidator, trigger: 'change', message: 'Пример подсети: 192.168.0.0/24' }
    ],
    description: [
      { required: true, message: 'Какае-то описание нужно', trigger: 'blur' }
    ],
    ip_start: [
      { required: true, message: 'Стартовый ip надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    ip_end: [
      { required: true, message: 'Конечный ip надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример ip: 192.168.0.23' }
    ],
    gateway: [
      { required: true, message: 'Шлюз надо указать', trigger: 'blur' },
      { validator: ipAddrValidator, trigger: 'change', message: 'Пример шлюза: 192.168.0.1' }
    ],
    pool_tag: [
      { validator: latinValidator, trigger: 'change', message: 'Только латинские символы' }
    ]
  }

  private frmMod = {
    network: NetworkIpPoolModule.network,
    description: NetworkIpPoolModule.description,
    groups: NetworkIpPoolModule.groups,
    ip_start: NetworkIpPoolModule.ip_start,
    ip_end: NetworkIpPoolModule.ip_end,
    gateway: NetworkIpPoolModule.gateway,
    is_dynamic: NetworkIpPoolModule.is_dynamic,
    pool_tag: NetworkIpPoolModule.pool_tag
  }

  get netId() {
    return NetworkIpPoolModule.id
  }
  @Watch('netId')
  private async onNetwCh() {
    this.frmMod = await NetworkIpPoolModule.GetAllPoolState()
  }

  get isNewPool() {
    return NetworkIpPoolModule.id === 0
  }

  created() {
    this.loadGroups()
  }

  private onSubmit() {
    (this.$refs['poolfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        if (this.isNewPool) {
          newDat = await NetworkIpPoolModule.AddPool(this.frmMod)
        } else {
          newDat = await NetworkIpPoolModule.PatchPool(this.frmMod)
        }
        this.isLoading = false
        this.$emit('done', newDat)
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private async loadGroups() {
    this.isLoading = true
    const { data } = await getGroups({
      page: 1,
      page_size: 500,
      fields: 'pk,title'
    })
    this.groups = data.results
    this.isLoading = false
  }
}
</script>
