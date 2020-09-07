<template>
  <div>
    <el-table
      v-loading="intLoading"
      v-el-table-infinite-scroll="infGetData"
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-bind="$attrs"
      :height="tblHeight"
      border
      v-on="listeners"
    >
      <slot name="columns">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :sortable="column.sortable ? 'custom' : false"
          :align="column.align"
          v-bind="column"
        >
          <template v-slot:default="{row}">
            <slot
              :name="column.prop"
              :row="row"
            >
              {{ row[column.prop] }}
            </slot>
          </template>
        </el-table-column>
      </slot>
    </el-table>
    <slot name="default" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { IDRFListResponse, IDRFRequestListParameters, IDRFAxiosResponseListPromise } from '@/api/types'

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

@Component({
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  }
})
export default class <T> extends Vue {
  @Prop({ default: () => [] }) private columns!: IDataTableColumn[]
  @Prop({ default: () => Promise.resolve([]) }) private getData!: (params: IDRFRequestListParameters) => IDRFAxiosResponseListPromise<T>
  @Prop({ default: null }) private fields?: string
  @Prop({ default: false }) private loading!: boolean
  @Prop({ default: (r: object) => ('') }) private tableRowClassName!: (r: object) => string
  @Prop({ default: 100 }) private heightDiff!: number

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

  get listeners() {
    return {
      ...this.$listeners,
      'sort-change': this.onSortChange
    }
  }

  get lDisabled() {
    return this.responseData.next === null
  }

  public async GetTableData(params: getTableDataParam = { page: 0, limit: 0 }, otherParams: object = {}) {
    this.page = 1
    this.loadRemoteData(params, otherParams)
  }

  private async loadRemoteData(params: getTableDataParam = { page: 0, limit: 0 }, otherParams: object = {}) {
    if (this.intLoading) return
    this.intLoading = true
    const { page } = params
    const allParams = Object.assign(otherParams, {
      page: page || this.page,
      page_size: 30,
      ordering: this.$route.query.ordering as string | undefined,
      fields: this.fields
    })
    try {
      let response = await this.getData(allParams)
      this.responseData = response.data
      if (this.page > 1) {
        this.tableData = this.tableData.concat(this.responseData.results)
      } else {
        this.tableData = this.responseData.results
      }
    } finally {
      this.intLoading = false
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
    if (orderField) {
      newQuery.ordering = orderField
    }
    if (newQuery.ordering !== qr.ordering) {
      this.$router.push({ path: this.$route.path, query: newQuery })
    }
  }

  created() {
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

  private infGetData() {
    if (this.intLoading || this.lDisabled) return
    this.page++
    this.loadRemoteData()
  }
}
</script>
