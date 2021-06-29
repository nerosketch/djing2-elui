<template lang="pug">
  div
    el-table(
      v-loading="intLoading"
      v-el-table-infinite-scroll="infGetData"
      :data="tableData"
      :row-class-name="tableRowClassName"
      :height="tblHeight"
      :default-sort="defaultSorting"
      v-bind="$attrs"
      border
      v-on="listeners"
    )
      slot(name="columns")
        el-table-column(
          v-if="selectable"
          type="selection"
          width="40"
          align="center"
        )
        template(v-for="col in localCols")
          el-table-column(
            v-if="col.visible"
            :key="col.prop"
            :sortable="col.sortable ? 'custom' : false"
            :align="col.align"
            :width="getColumnWidth(col)"
            v-bind="col"
          )
            template(v-slot:default="{row}")
              slot(
                :name="col.prop"
                :row="row"
              ) {{ row[col.prop] }}
    slot(name="default")

    el-dialog(
      title="Отображаемые поля таблицы"
      :visible.sync="editFieldsVisibleloc"
      :close-on-click-modal="false"
    )
      template(v-if="editFieldsVisibleloc")
        datatable-edit-fields(
          :columns.sync="localCols"
          :storePrefix="widthStorageNamePrefix"
          v-on:done="editFieldsVisibleloc=false"
        )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { IDRFListResponse, IDRFRequestListParameters, IDRFAxiosResponseListPromise } from '@/api/types'
import DatatableEditFields from './edit-fields.vue'

export enum DataTableColumnAlign {
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right'
}

export interface IDataTableColumn {
  sortable?: boolean
  prop: string
  label: string
  align?: DataTableColumnAlign
  'min-width'?: number
}

export interface ILocalDataTableColumn extends IDataTableColumn {
  visible: boolean
}

export class DataTableColumn implements IDataTableColumn {
  sortable = false
  prop = 'Prop'
  label = 'Label'
  align = DataTableColumnAlign.LEFT
}

interface getTableDataParam {
  page: number
  limit: number
}

function loadFieldVisibility(pref: string, col: IDataTableColumn): boolean {
  const store = localStorage.getItem(`${pref}_visible_${col.prop}`)
  if (store === null || store === '1') {
    return true
  }
  return false
}

@Component({
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  components: {
    DatatableEditFields
  }
})
export default class <T> extends Vue {
  @Prop({ default: () => [] }) private columns!: IDataTableColumn[]
  @Prop({ default: () => Promise.resolve([]) }) private getData!: (params: IDRFRequestListParameters) => IDRFAxiosResponseListPromise<T>
  @Prop({ default: false }) private loading!: boolean
  @Prop({ default: () => ('') }) private tableRowClassName!: (r: object) => string
  @Prop({ default: 118 }) private heightDiff!: number
  @Prop({ default: 'width' }) private widthStorageNamePrefix!: string
  @Prop({ default: false }) private selectable!: boolean
  @Prop({ default: false }) private editFieldsVisible!: boolean

  @Watch('loading')
  private onChangeLoading(l: boolean) {
    this.intLoading = l
  }

  private responseData: IDRFListResponse<T> = {
    count: 0,
    next: null,
    previous: null,
    results: []
  }
  private tableData: T[] = []
  private page = 1
  private intLoading = false
  private tblHeight = 0
  private endPage = false
  private loadBusy = false
  private editFieldsVisibleloc = false
  private localCols: ILocalDataTableColumn[] = []

  @Watch('editFieldsVisible')
  private onChVis(i: boolean) {
    this.editFieldsVisibleloc = i
  }

  @Watch('editFieldsVisibleloc')
  private onChLoc(i: boolean) {
    this.$emit('update:editFieldsVisible', i)
  }

  @Watch('localCols')
  private onChLocCols(lcols: ILocalDataTableColumn[]) {
    this.$emit('update:columns', lcols)
  }

  get listeners() {
    return {
      ...this.$listeners,
      'sort-change': this.onSortChange,
      'header-dragend': this.onFieldWidthChange
    }
  }

  get lDisabled() {
    return this.responseData.next === null
  }

  public async GetTableData(params: getTableDataParam = { page: 0, limit: 0 }, otherParams: object = {}) {
    this.page = 1
    this.endPage = false
    if (this.intLoading) return
    try {
      this.intLoading = true
      await this.loadRemoteData(params, otherParams)
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.intLoading = false
    }
  }

  private async loadRemoteData(params: getTableDataParam = { page: 0, limit: 0 }, otherParams: object = {}) {
    const { page } = params
    const allParams = Object.assign(otherParams, {
      page: page || this.page,
      page_size: 60,
      ordering: this.$route.query.ordering as string | undefined
    })
    let response = await this.getData(allParams)
    this.responseData = response.data
    if (response.data.next === null) {
      this.endPage = true
    }
    if (this.page > 1) {
      this.tableData = this.tableData.concat(this.responseData.results)
    } else {
      this.tableData = this.responseData.results
    }
  }

  private onSortChange(data: any) {
    this.page = 1
    const { prop, order } = data
    if (prop !== null) {
      const dir = order === 'ascending' ? '' : '-'
      this.onChangeOrderingField(`${dir}${prop}`)
    } else {
      this.onChangeOrderingField(undefined)
    }
    this.GetTableData()
  }

  private onChangeOrderingField(orderField?: string) {
    let qr = this.$route.query as Record<string, any>
    let newQuery = Object.assign({}, qr)
    if (orderField == qr.ordering) {
      delete newQuery.ordering
    } else {
      newQuery.ordering = orderField
    }
    this.$router.push({ path: this.$route.path, query: newQuery })
  }

  get defaultSorting() {
    let field = this.$route.query.ordering as string | undefined
    if (field) {
      let orderDir = 'ascending'
      if (field.startsWith('-')) {
        field = field.replace('-', '')
        orderDir = 'descending'
      }
      return {
        prop: field,
        order: orderDir
      }
    }
    return {}
  }

  created() {
    this.localCols = this.columns.map(col => Object.assign(col, {
      visible: loadFieldVisibility(this.widthStorageNamePrefix, col)
    }))

    this.GetTableData()
    window.addEventListener('resize', this.onWinResize)
    this.onWinResize()
  }
  beforeDestroy() {
    window.removeEventListener('resize', this.onWinResize)
  }

  private onWinResize() {
    this.tblHeight = window.innerHeight - this.heightDiff
  }

  private async infGetData() {
    if (this.loadBusy || this.lDisabled || this.endPage) return
    try {
      this.loadBusy = true
      this.page++
      await this.loadRemoteData()
    } catch (err) {
      this.$message.error(err)
    } finally {
      this.loadBusy = false
    }
  }

  private onFieldWidthChange(newWidth: number, oldWidth: number, column: any) {
    localStorage.setItem(`${this.widthStorageNamePrefix}_${column.property}`, String(newWidth))
  }

  private getColumnWidth(column: IDataTableColumn): string | null {
    return localStorage.getItem(`${this.widthStorageNamePrefix}_${column.prop}`)
  }
}
</script>
