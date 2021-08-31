<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadPayGws"
      widthStorageNamePrefix='gws'
      ref='table'
    )
      template(v-slot:title="{row}")
        router-link(:to="{ name: 'finReport' }")
          el-link(type='primary') {{ row.title }}
      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            v-if="$perms.is_superuser"
            @click="openSitesDlg(row)"
          ) C
          el-button(icon="el-icon-edit" @click="openEdit(row)")
          el-button(
            type="danger" icon="el-icon-delete" @click="delPayGw(row)"
            :disabled="!$perms.fin_app.delete_payalltimegateway"
          )

      el-button(
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить шлюз

    el-dialog(
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      pay-gw-form(
        v-on:done="frmDone"
      )

    el-dialog(
      title="Принадлежность сайтам"
      :visible.sync="sitesDlg"
      :close-on-click-modal="false"
    )
      sites-attach(
        :selectedSiteIds="$store.state.payalltimegateway.sites"
        v-on:save="payGwSitesSave"
      )

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { IDRFRequestListParameters } from '@/api/types'
import { getPayGateways } from '@/api/fin/req'
import { IPayAllTimeGateway } from '@/api/fin/types'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { PayAllTimeGatewayModule } from '@/store/modules/fin'
import PayGwForm from './gw-form.vue'

class DataTableComp extends DataTable<IPayAllTimeGateway> {}

@Component({
  name: 'GwList',
  components: {
    PayGwForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }
  private dialogTitle = 'Платёжный шлюз'
  private dialogVisible = false
  private sitesDlg = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'service_id',
      label: 'Service ID',
      sortable: true,
      'min-width': 100
    },
    {
      prop: 'slug',
      label: 'путь'
    },
    {
      prop: 'secret',
      label: 'secret'
    },
    {
      prop: 'pay_count',
      label: 'Количество платежей'
    },
    {
      prop: 'oper',
      label: 'Кнопки',
      'min-width': 180,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadPayGws(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,service_id,slug,secret,pay_count,sites'
    }
    return getPayGateways(params)
  }

  private openEdit(gw: IPayAllTimeGateway) {
    PayAllTimeGatewayModule.SET_ALL_PAYGW(gw)
    this.dialogTitle = 'Изменить платёжный шлюз'
    this.dialogVisible = true
  }
  private delPayGw(gw: IPayAllTimeGateway) {
    this.$confirm('Удалить платёжный шлюз?').then(async() => {
      await PayAllTimeGatewayModule.DelPayGroup(gw.id)
      this.$refs.table.GetTableData()
    })
  }
  private openNew() {
    PayAllTimeGatewayModule.RESET_ALL_PAYGW()
    this.dialogTitle = 'Создать платёжный шлюз'
    this.dialogVisible = true
  }
  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
    this.$message.success('Платёжный шлюз добавлен')
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Финансы'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs

  private payGwSitesSave(selectedSiteIds: number[]) {
    PayAllTimeGatewayModule.PatchPayGw({
      sites: selectedSiteIds
    }).then(() => {
      this.$refs.table.GetTableData()
      this.$message.success('Принадлежность платёжного шлюза сайтам сохранена')
    })
    this.sitesDlg = false
  }
  private openSitesDlg(grp: IPayAllTimeGateway) {
    PayAllTimeGatewayModule.SET_ALL_PAYGW(grp)
    this.sitesDlg = true
  }
}
</script>
