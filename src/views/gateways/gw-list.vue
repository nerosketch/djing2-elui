<template lang="pug">
  .app-container
    el-row(v-loading="loadingGws", :gutter="10")
      el-col(
        :xs="24"
        :md="12"
        :xl="6"
        v-for="(gw, i) in gwlist"
        :key="i"
        style="margin-bottom: 10px;")
        el-card(shadow="hover")
          template(v-slot:header)
            .clearfix
              | {{ gw.title }}

          dl
            dt
              b
                | {{ $t('idres') }}

            dd
              | {{ gw.ip_address }}

            dt
              b
                | {{ $t('port') }}

            dd
              | {{ gw.ip_port }}

            dt
              b
                | {{ $t('inletLogin') }}

            dd
              | {{ gw.auth_login }}

            dt
              b
                | {{ $t('inletPassword') }}

            dd
              | {{ gw.auth_passw }}

            dt
              b
                | {{ $t('likeUs') }}

            dd
              | {{ gw.gw_type_str }}

            dt
              b
                | {{ $t('default') }}

            dd
              i
                | {{ gw.is_default ? 'Да' : 'Нет' }}

            dt
              b
                | {{ $t('included') }}

            dd
              i
                | {{ gw.enabled ? 'Да' : 'Нет' }}

            dt
              b
                | {{ $t('itSABonus') }}

            dd
              i
                | {{ gw.customer_count }}

            dt
              b
                | {{ $t('activeCustomersCount') }}

            dd
              i
                | {{ gw.customer_count_active }}

            dt
              b
                | {{ $t('service') }}

            dd
              i
                | {{ gw.customer_count_w_service }}

            dt
              b
                | {{ $t('dateOfEstablishment') }}

            dd
              i
                | {{ gw.create_time }}

            dt
              b
                | {{ $t('addresses') }}

            dd
              i
                | {{ gw.place || ' - ' }}

          el-button-group
            el-button(
              icon="el-icon-edit"
              @click="openGwForm(gw)"
              :disabled="!$perms.gateways.change_gateway")
              | {{ $t('amend') }}

            el-button(
              type="danger"
              icon="el-icon-delete"
              @click="onDel(gw)"
              :disabled="!$perms.gateways.delete_gateway")
              | {{ $t('delete.') }}

    el-button(
      type="success"
      icon="el-icon-plus"
      @click="onAdd"
      :disabled="!$perms.gateways.add_gateway")
      | {{ $t('add') }}

    el-dialog(
      :visible.sync="gwFormDialog"
      :title="$t('modifyAccessLock')"
      :close-on-click-modal="false")
      gw-form(v-on:done="gwFrmDone", v-on:err="gwFormDialog=false")
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { IGateway } from '@/api/gateways/types'
import GwForm from './gw-form.vue'
import { GatewayModule } from '@/store/modules/gateways'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import GwsMethods from './gws-methods'

@Component({
  name: 'GwList',
  components: {
    GwForm
  }
})
export default class extends mixins(GwsMethods) {
  private gwFormDialog = false

  created() {
    this.loadGateways()

    // Breadcrumbs
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: this.$t('locks')
        }
      }
    ] as any)
    // End Breadcrumbs
  }

  private openGwForm(gw: IGateway) {
    GatewayModule.SET_ALL_GATEWAY(gw)
    this.gwFormDialog = true
  }

  private gwFrmDone() {
    this.gwFormDialog = false
    this.$message.success(this.$t('accessLockSecure'))
    this.loadGateways()
  }

  private onDel(gw: IGateway) {
    this.$confirm(this.$t('removeGatewayQuestion')).then(async() => {
      this.loadingGws = true
      await GatewayModule.DelGateway(gw.id)
      this.$message.success(this.$t('accessLockSuccessfullyRemoved'))
      this.loadGateways()
    }).catch(() => {
      this.loadingGws = false
    })
  }

  private onAdd() {
    GatewayModule.RESET_ALL_GATEWAY()
    this.gwFormDialog = true
  }
}
</script>
