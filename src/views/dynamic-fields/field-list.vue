<template lang="pug">
  .app-container
    datatable(
      :columns="tableColumns"
      :getData="loadFields"
      widthStorageNamePrefix="dfl"
      ref="fieldtable")
      template(#btn="{row}")
        el-button-group
          el-button(icon="el-icon-edit" @click="editField(row)")

          el-button(
            type="danger"
            icon="el-icon-close"
            @click="delDynamicField(row)")

      el-button(icon="el-icon-plus" @click="openNew")
        | {{ $t('addFields') }}

    el-dialog(
      :title="$t('field')"
      :visible.sync="fieldFormVisible"
      :close-on-click-modal="false")
      field-form(@done="formDone")
</template>

<script lang="ts">
import { IDRFRequestListParameters } from '@/api/types'
import { Component, Vue } from 'vue-property-decorator'
import { getFields } from '@/api/dynamic-fields/req'
import { IDynamicField } from '@/api/dynamic-fields/types'
import DataTable, { IDataTableColumn, DataTableColumnAlign } from '@/components/Datatable/index.vue'
import FieldForm from './field-form.vue'
import { DynamicFieldModule } from '@/store/modules/dynamicfields/dynamic-field'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'

class DataTableComp extends DataTable<IDynamicField> {}

@Component({
  name: 'FieldList',
  components: {
    FieldForm,
    datatable: DataTableComp
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
      label: this.$tc('title'),
      'min-width': 150
    },
    {
      prop: 'field_type_name',
      label: this.$tc('typeOfField')
    },
    {
      prop: 'groups',
      label: this.$tc('route.groups')
    },
    {
      prop: 'system_tag_name',
      label: this.$tc('systemTag')
    },
    {
      prop: 'user_tag',
      label: this.$tc('userTag')
    },
    {
      prop: 'btn',
      label: '#',
      'min-width': 90,
      align: DataTableColumnAlign.CENTER
    }
  ]

  private loadFields(params?: IDRFRequestListParameters) {
    return getFields(params)
  }

  private delDynamicField(field: IDynamicField) {
    this.$confirm(`${this.$tc('deleteTheField')} ${field.title}?`).then(async() => {
      await DynamicFieldModule.DeleteField(field.id)
      this.$message.success(`${this.$tc('fieldRemoved')} ${field.title}`)
      this.$refs.fieldtable.LoadTableData()
    })
  }

  private editField(field: IDynamicField) {
    this.fieldFormVisible = true
    DynamicFieldModule.SET_ALL_DYFIELD(field)
  }

  private formDone() {
    this.fieldFormVisible = false
    this.$message.success(this.$tc('saved'))
    this.$refs.fieldtable.LoadTableData()
  }

  private async openNew() {
    await DynamicFieldModule.RESET_ALL_DYFIELD()
    this.fieldFormVisible = true
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        meta: {
          hidden: true,
          title: this.$tc('forms')
        }
      }
    ] as any)
  }
  // End Breadcrumbs
}
</script>
