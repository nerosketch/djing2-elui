<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadMessengers"
      widthStorageNamePrefix="messengers"
      ref="table")
      template(#title="{row}")
        el-link(
          type="primary"
          :href="row.global_link"
          target="_blank")
          | {{ row.title }}

      template(#oper="{row}")
        el-button-group
          el-button(
            type="danger"
            icon="el-icon-delete"
            @click="delMessenger(row)")

          el-button(icon="el-icon-view" @click="go2Messenger(row)")

      el-button(icon="el-icon-plus" @click="openNew")
        | {{ $t('addMassenger') }}

    el-dialog(
      :title="$t('createAMassenger')"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false")
      messenger-form(v-on:done="frmDone")
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import MessengerForm from './messenger-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { IMessenger } from '@/api/messenger/types'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { getMessengers } from '@/api/messenger/req'

class DataTableComp extends DataTable<IMessenger> {}

@Component({
  name: 'MessengerList',
  components: {
    MessengerForm,
    datatable: DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    table: DataTableComp
  }

  @Prop({ required: true })
  private messengerTypeName!: string

  private dialogVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'id',
      label: 'ID',
      'min-width': 70
    },
    {
      prop: 'title',
      label: this.$tc('title'),
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'description',
      label: this.$tc('description')
    },
    {
      prop: 'bot_type_name',
      label: this.$tc('typeOfBean'),
      'min-width': 100
    },
    {
      prop: 'oper',
      label: '#',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openNew() {
    await MessengerModule.RESET_ALL_MESSENGER()
    this.dialogVisible = true
  }

  private loadMessengers(params?: IDRFRequestListParameters) {
    if (params) {
      params.fields = 'id,title,description,bot_type_name,global_link'
    }
    return getMessengers(this.messengerTypeName, params)
  }

  private delMessenger(m: IMessenger) {
    this.$confirm(this.$tc('messenger.austRemove', 1, [m.title])).then(async() => {
      await MessengerModule.DelMessenger(m.id)
      this.$message.success(this.$tc('messenger.botRemoved', 1, [m.title]))
      this.$refs.table.LoadTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.LoadTableData()
  }

  private go2Messenger(m: IMessenger) {
    this.$router.push({
      name: 'messengerDetails',
      params: {
        mId: m.id.toString(),
        messengerTypeName: this.messengerTypeName
      }
    })
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/messenger',
        meta: {
          hidden: true,
          title: this.$tc('messengers')
        }
      },
      {
        path: '/messenger',
        meta: {
          hidden: true,
          title: this.messengerTypeName
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
