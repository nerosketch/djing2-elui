<template lang="pug">
  el-form(
    ref='poolfrm'
    label-width="120px"
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
      label="Vlan"
      prop="vlan_if"
    )
      el-select(v-model="frmMod.vlan_if" v-loading='vlanLoading')
        el-option(
          v-for="v in vlans"
          :key="v.id"
          :label="`[${v.vid}] ${v.title}`"
          :value="v.id"
        )
    el-form-item(
      label='Тип сети'
      prop='kind'
    )
      el-select(v-model="frmMod.kind")
        el-option(
          v-for="k in networkPoolKinds"
          :key="k.val"
          :label="k.title"
          :value="k.val"
        )
    el-form-item(
      label='Динамический'
      prop='is_dynamic'
    )
      el-checkbox(v-model="frmMod.is_dynamic") {{ frmMod.is_dynamic ? 'Да' : 'Нет' }}
    el-form-item(
      label="Описание"
      prop='description'
    )
      el-input(v-model="frmMod.description" type="textarea" rows="5" autosize)
    el-form-item
      el-button(
        type="primary"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isFormUntouched"
      ) Сохранить
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { mixins } from 'vue-class-component'
import { ipAddrValidator, ipAddrMaskValidator } from '@/utils/validate'
import { NetworkIpPoolModule } from '@/store/modules/networks/netw_pool'
import { IGroup } from '@/api/groups/types'
import { getGroups } from '@/api/groups/req'
import FormMixin from '@/utils/forms'
import VlanMixin from './vlan-mixin'
import { INetworkIpPool } from '@/api/networks/types'

@Component({
  name: 'pool-form'
})
export default class extends mixins(FormMixin, VlanMixin) {
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
    ]
  }

  private frmMod: INetworkIpPool = {
    id: NetworkIpPoolModule.id,
    network: NetworkIpPoolModule.network,
    description: NetworkIpPoolModule.description,
    groups: NetworkIpPoolModule.groups,
    ip_start: NetworkIpPoolModule.ip_start,
    ip_end: NetworkIpPoolModule.ip_end,
    gateway: NetworkIpPoolModule.gateway,
    is_dynamic: NetworkIpPoolModule.is_dynamic,
    vlan_if: NetworkIpPoolModule.vlan_if,
    kind: NetworkIpPoolModule.kind
  }

  private networkPoolKinds = [
    { val: 0, title: 'Не определён' },
    { val: 1, title: 'Интернет' },
    { val: 2, title: 'Гостевой' },
    { val: 3, title: 'Доверенный' },
    { val: 4, title: 'Устройства' },
    { val: 5, title: 'Административный' },
  ]

  @Watch('$store.state.netpool', { deep: true })
  private async onNetwCh(nstate: INetworkIpPool) {
    this.frmMod = {...nstate}
    this.frmInitial = {...nstate}
  }

  get isNewPool() {
    return NetworkIpPoolModule.id === 0
  }

  created() {
    this.loadGroups()
    this.frmInitial = Object.assign({}, this.frmMod)
    this.loadVlans(undefined, 'id,title,vid')
  }

  private onSubmit() {
    (this.$refs['poolfrm'] as Form).validate(async valid => {
      if (valid) {
        this.isLoading = true
        let newDat
        try {
          if (this.isNewPool) {
            newDat = await NetworkIpPoolModule.AddPool(this.frmMod)
          } else {
            newDat = await NetworkIpPoolModule.PatchPool(this.frmMod)
          }
          this.$emit('done', newDat)
        } catch (err) {
          this.$message.error(err)
        } finally {
          this.isLoading = false
        }
      } else {
        this.$message.error('Исправь ошибки в форме')
      }
    })
  }

  private async loadGroups() {
    this.isLoading = true
    try {
      const { data } = await getGroups({
        page: 1,
        page_size: 0,
        fields: 'pk,title'
      }) as any
      this.groups = data
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.isLoading = false
    }
  }
}
</script>
