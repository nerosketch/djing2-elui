<template lang="pug">
.app-container
  span Дата отсчёта:
  el-date-picker(
    v-model="reqParams.date_limit"
    type="datetime"
    value-format="yyyy-MM-dd HH:mm"
    format="d.MM.yyyy HH:mm"
    placeholder="Дата отсчёта"
  )
  span  Лимит вывода:
  el-input(
    placeholder="Лимит вывода"
    :style="{width: '150px'}"
    type="number"
    v-model="reqParams.out_limit"
  )
  datatable(
    :columns="tableColumns"
    :getData="loadAfk"
    widthStorageNamePrefix='usersafk'
    ref='afktbl'
  )
    template(v-slot:customer_uname="{row}")
      router-link(:to="{name: 'customerDetails', params:{uid: row.customer_id }}")
        el-link(type="primary") {{ row.customer_uname }}

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { ICustomerAfkItem, ICustomerAfkItemParams } from '@/api/customers/types'
import { getCustomersAfk } from '@/api/customers/req'

class DataTableComp extends DataTable<ICustomerAfkItem> {}

@Component({
  name: 'AfkList',
  components: {
    datatable: DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    afktbl: DataTableComp
  }

  private reqParams: ICustomerAfkItemParams = {
    date_limit: null,
    out_limit: 50
  }

  @Watch('reqParams', { deep: true })
  private onChangeparams() {
    this.$refs.afktbl.LoadTableData()
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'customer_uname',
      label: 'логин'
    },
    {
      prop: 'customer_fio',
      label: 'ФИО'
    },
    {
      prop: 'last_date',
      label: 'дата'
    },
    {
      prop: 'timediff',
      label: 'Продолжительность'
    }
  ]

  private loadAfk(params?: IDRFRequestListParameters) {
    return getCustomersAfk(this.reqParams)
  }

  // Breadcrumbs
  created() {
    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Фильтр afk'
        }
      }
    ] as any[])
  }
  // End Breadcrumbs
}
</script>
