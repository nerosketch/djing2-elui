<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadMessengers"
      widthStorageNamePrefix='messengers'
      ref='table'
    )
      template(v-slot:title="{row}")
        el-link(
          type='primary'
          :href="row.global_link"
          target="_blank"
        ) {{ row.title }}

      template(v-slot:oper="{row}")
        el-button-group
          el-button(
            type="danger" icon="el-icon-delete" size="mini"
            @click="delMessenger(row)"
          )
          el-button(
            icon="el-icon-view" size="mini"
            @click="go2Messenger(row)"
          )

      el-button(
        size='mini'
        icon='el-icon-plus'
        @click='openNew'
      ) Добавить Messenger

    el-dialog(
      title="Создать messenger"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    )
      messenger-form(
        v-on:done="frmDone"
      )

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import MessengerForm from './messenger-form.vue'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { RouteRecord } from 'vue-router'
import { IMessenger } from '@/api/messenger/types'
import { MessengerModule } from '@/store/modules/messenger/base-messenger'
import { getMessengers } from '@/api/messenger/req'

class DataTableComp extends DataTable<IMessenger> {}

@Component({
  name: 'MessengerList',
  components: {
    MessengerForm,
    'datatable': DataTableComp
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
      label: 'Название',
      sortable: true,
      'min-width': 250
    },
    {
      prop: 'description',
      label: 'Описание'
    },
    {
      prop: 'bot_type_name',
      label: 'Тип бота',
      'min-width': 100
    },
    {
      prop: 'oper',
      label: 'Oper',
      'min-width': 130,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private async openNew() {
    await MessengerModule.RESET_ALL_MESSENGER()
    this.dialogVisible = true
  }

  private async loadMessengers(params?: IDRFRequestListParameters) {
    if (params) {
      params['fields'] = 'id,title,description,bot_type_name,global_link'
    }
    try {
      const r = await getMessengers(this.messengerTypeName, params)
      return r
    } catch (err) {
      this.$message.error(err)
    }
    return null
  }

  private delMessenger(m: IMessenger) {
    this.$confirm(`Ты действительно хочешь удалить чат бот "${m.title}"?`).then(async() => {
      await MessengerModule.DelMessenger(m.id)
      this.$message.success(`Чат бот "${m.title}" удалён`)
      this.$refs.table.GetTableData()
    })
  }

  private frmDone() {
    this.dialogVisible = false
    this.$refs.table.GetTableData()
  }

  private go2Messenger(m: IMessenger) {
    this.$router.push({ name: 'messengerDetails', params: {
      mId: m.id.toString(),
      messengerTypeName: this.messengerTypeName
    }})
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/messenger',
        meta: {
          hidden: true,
          title: 'Мессенджеры'
        }
      },
      {
        path: '/messenger',
        meta: {
          hidden: true,
          title: this.messengerTypeName
        }
      }
    ] as RouteRecord[])
  }
  // End Breadcrumbs
}
</script>