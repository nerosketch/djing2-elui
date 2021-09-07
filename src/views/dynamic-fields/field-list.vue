<template lang="pug">
.app-container
  datatable(
    :columns="tableColumns"
    :getData="loadFields"
    widthStorageNamePrefix='dfl'
    ref='fieldtable'
  )
    template(v-slot:btn="{row}")
      el-button-group
        el-button(
          icon='el-icon-edit'
          @click="editField(row)"
        )
        el-button(
          type="danger"
          icon='el-icon-close'
          @click="delDynamicField(row)"
        )
    el-button(
      icon='el-icon-plus'
      @click='openNew'
    ) Добавить поля
  
  el-dialog(
    title="Поле"
    :visible.sync="fieldFormVisible"
    :close-on-click-modal="false"
  )
    field-form(
      @done="formDone"
    )
</template>

<script lang="ts">
import { IDRFRequestListParameters } from '@/api/types'
import { Component, Vue } from 'vue-property-decorator'
import { getFields } from '@/api/dynamic-fields/req'
import { IDynamicField } from '@/api/dynamic-fields/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import FieldForm from './field-form.vue'
import { DynamicFieldModule } from '@/store/modules/dynamicfields/dynamic-field'

class DataTableComp extends DataTable<IDynamicField> {}

@Component({
  name: 'FieldList',
  components: {
    FieldForm,
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    fieldtable: DataTableComp
  }
  private fieldFormVisible = false

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'title',
      label: 'Название',
      'min-width': 150
    },
    {
      prop: 'field_type_name',
      label: 'Тип поля'
    },
    {
      prop: 'groups',
      label: 'Группы'
    },
    {
      prop: 'btn',
      label: '—',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadFields(params?: IDRFRequestListParameters) {
    return getFields(params)
  }

  private delDynamicField(field: IDynamicField) {
    this.$confirm(`Удалить поле "${field.title}"?`).then(async() => {
      await DynamicFieldModule.DeleteField(field.id)
      this.$message.success(`Поле "${field.title}" удалено`)
      this.$refs.fieldtable.GetTableData()
    })
  }

  private editField(field: IDynamicField) {
    this.fieldFormVisible = true
    DynamicFieldModule.SET_ALL_DYFIELD(field)
  }

  private formDone(field: IDynamicField) {
    this.fieldFormVisible = false
    this.$message.success('Сохранено')
    this.$refs.fieldtable.GetTableData()
  }

  private async openNew() {
    await DynamicFieldModule.RESET_ALL_DYFIELD()
    this.fieldFormVisible = true
  }
}
</script>
