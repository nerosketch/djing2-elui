<template>
  <div class="app-container">
    <el-row v-loading="loadingGws" :gutter="10">
      <el-col :xs="24" :md="12" :xl="6" v-for="(gw, i) in gwlist" :key="i" style="margin-bottom: 10px;">
        <el-card shadow="hover">
          <template v-slot:header>
            <div class="clearfix">{{ gw.title }}</div>
          </template>
          <dl>
            <dt><b>{{ $t('ip-adres-0') }}</b></dt>
            <dd>{{ gw.ip_address }}</dd>
            <dt><b>{{ $t('port-1') }}</b></dt>
            <dd>{{ gw.ip_port }}</dd>
            <dt><b>{{ $t('login-dlya-vkhoda-0') }}</b></dt>
            <dd>{{ gw.auth_login }}</dd>
            <dt><b>{{ $t('parol-dlya-vkhoda-0') }}</b></dt>
            <dd>{{ gw.auth_passw }}</dd>
            <dt><b>{{ $t('tip-nas-0') }}</b></dt>
            <dd>{{ gw.gw_type_str }}</dd>
            <dt><b>{{ $t('po-umolchaniyu-0') }}</b></dt>
            <dd><i>{{ gw.is_default ? 'Да' : 'Нет' }}</i></dd>
            <dt><b>{{ $t('vklyuchen-0') }}</b></dt>
            <dd><i>{{ gw.enabled ? 'Да' : 'Нет' }}</i></dd>
            <dt><b>{{ $t('vsego-abon') }}</b></dt>
            <dd><i>{{ gw.customer_count }}</i></dd>
            <dt><b>{{ $t('aktivnykh-abon') }}</b></dt>
            <dd><i>{{ gw.customer_count_active }}</i></dd>
            <dt><b>{{ $t('abony-s-uslugoi') }}</b></dt>
            <dd><i>{{ gw.customer_count_w_service }}</i></dd>
            <dt><b>{{ $t('data-sozdaniya') }}</b></dt>
            <dd><i>{{ gw.create_time }}</i></dd>
            <dt><b>{{ $t('adres-0') }}</b></dt>
            <dd><i>{{ gw.place || ' - ' }}</i></dd>
          </dl>
          <el-button-group>
            <el-button icon="el-icon-edit" @click="openGwForm(gw)" :disabled="!$perms.gateways.change_gateway">{{ $t('izmenit') }}</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="onDel(gw)" :disabled="!$perms.gateways.delete_gateway">{{ $t('udalit-0') }}</el-button>
          </el-button-group>
        </el-card>
      </el-col>
    </el-row>
    <el-button type="success" icon="el-icon-plus" @click="onAdd" :disabled="!$perms.gateways.add_gateway">{{ $t('add') }}</el-button>
    <el-dialog :visible.sync="gwFormDialog" title="$t('izmenit-shlyuz-dostupa')" :close-on-click-modal="false">
      <gw-form v-on:done="gwFrmDone" v-on:err="gwFormDialog=false"></gw-form>
    </el-dialog>
  </div>
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
          title: this.$t('shlyuzy')
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
    this.$message.success(this.$t('shlyuz-dostupa-sokhranyon'))
    this.loadGateways()
  }

  private onDel(gw: IGateway) {
    this.$confirm(this.$t('udalit-shlyuz-dostupa-abonentov')).then(async() => {
      this.loadingGws = true
      await GatewayModule.DelGateway(gw.id)
      this.$message.success(this.$t('shlyuz-dostupa-uspeshno-udalyon'))
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
