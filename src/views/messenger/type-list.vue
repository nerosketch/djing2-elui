<template lang="pug">
  el-table.app-container(
    v-loading='messengerTypesLoading'
    :data="messengerBotTypes"
    border fit
  )
    el-table-column(
      label="Тип бота"
      prop='text'
    )
      template(v-slot:default="{row}")
        router-link(
          :to="{ name: 'messengerList', params: { messengerTypeName: row.text } }"
        ) {{ row.text }}

</template>

<script lang="ts">
import { BreadcrumbsModule } from '@/store/modules/breadcrumbs'
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import BotTypesMixin from './bot_types_mixin'

@Component({
  name: 'MessengerTypeList'
})
export default class extends mixins(BotTypesMixin) {
  created() {
    this.loadMessengerTypes()

    BreadcrumbsModule.SetCrumbs([
      {
        path: '/',
        meta: {
          hidden: true,
          title: 'Мессенджеры'
        }
      }
    ] as any)
  }
}
</script>
