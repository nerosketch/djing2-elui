<template lang="pug">
.app-container
  el-row(v-loading="loading" :gutter="10")
    el-col(:xs="24" :md="12" :xl="6" v-for="(gw, i) in gwlist" :key="i" style="margin-bottom: 10px;")
      el-card.box-card(shadow="hover")
        template(v-slot:header)
          .clearfix {{ gw.title }}
        dl
          dt
            b IP адрес
          dd {{ gw.ip_address }}
          dt
            b Порт
          dd {{ gw.ip_port }}
          dt
            b Логин для входа
          dd {{ gw.auth_login }}
          dt
            b Пароль для входа
          dd {{ gw.auth_passw }}
          dt
            b Тип NAS
          dd {{ gw.gw_type_str }}
          dt
            b По умолчанию
          dd
            i {{ gw.is_default ? 'Да' : 'Нет' }}
          dt
            b Включен
          dd
            i {{ gw.enabled ? 'Да' : 'Нет' }}
        el-button-group
          el-button(size='mini' icon='el-icon-edit' @click="openGwForm(gw)") Изменить
          el-button(size='mini' type="danger" icon='el-icon-delete' @click="onDel(gw)") Удалить

  el-button(size='mini' type="success" icon='el-icon-plus' @click="onAdd") Добавить

  el-dialog(
    :visible.sync="gwFormDialog"
    title="Изменить шлюз доступа"
  )
    gw-form(
      v-on:done="gwFrmDone"
      v-on:err="gwFormDialog=false"
    )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IGateway } from '@/api/gateways/types'
import { getGateways } from '@/api/gateways/req'
import GwForm from './gw-form.vue'
import { GatewayModule } from '@/store/modules/gateways'

@Component({
  name: 'GwList',
  components: {
    GwForm
  }
})
export default class extends Vue {
  private gwlist: IGateway[] = []
  private loading = false
  private gwFormDialog = false

  private async loadGateways() {
    this.loading = true
    const { data } = await getGateways({
      page: 1,
      page_size: 100500
    })
    this.gwlist = data.results
    this.loading = false
  }

  created() {
    this.loadGateways()
  }

  private openGwForm(gw: IGateway) {
    GatewayModule.SET_ALL_GATEWAY(gw)
    this.gwFormDialog = true
  }

  private gwFrmDone(gw: IGateway) {
    this.gwFormDialog = false
    this.$message.success("Шлюз доступа сохранён")
    this.loadGateways()
  }

  private onDel(gw: IGateway) {
    this.$confirm("Удалить шлюз доступа абонентов?").then(async() => {
      this.loading = true
      await GatewayModule.DelGateway(gw.id)
      this.$message.success("Шлюз доступа успешно удалён")
      this.loadGateways()
    }).catch(() => {
      this.loading = false
    })
  }

  private onAdd() {
    GatewayModule.RESET_ALL_GATEWAY()
    this.gwFormDialog = true
  }
}
</script>
