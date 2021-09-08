<template lang="pug">
.app-container
  datatable(
    :columns="tableColumns"
    :getData="loadAfk"
    widthStorageNamePrefix='usersafk'
    ref='afktbl'
  )
    template(v-slot:customer_uname="{row}")
      router-link(:to="{name: 'customerDetails', params:{uid: row.customer_id }}") {{ row.customer_uname }}

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { IDRFRequestListParameters } from '@/api/types'
import DataTable, { IDataTableColumn } from '@/components/Datatable/index.vue'
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { ICustomerAfkItem } from '@/api/customers/types'
import { getCustomersAfk } from '@/api/customers/req'

class DataTableComp extends DataTable<ICustomerAfkItem> {}

@Component({
  name: 'AfkList',
  components: {
    'datatable': DataTableComp
  }
})
export default class extends Vue {
  public readonly $refs!: {
    afktbl: DataTableComp
  }

  private tableColumns: IDataTableColumn[] = [
    {
      prop: 'customer_uname',
      label: 'логин',
    },
    {
      prop: 'customer_fio',
      label: 'ФИО',
    },
    {
      prop: 'last_date',
      label: 'дата',
    }
  ]

  private loadAfk(params?: IDRFRequestListParameters) {
    return getCustomersAfk()
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
