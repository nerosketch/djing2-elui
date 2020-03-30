<template lang="pug">
  el-row
    el-col(:span='12')
      el-card.box-card
        .clearfix(slot='header')
          span Изменение абонента
        customer-form

    h4 Баланс 0.4
    el-tabs.border-card
      el-tab-pane(label="Инфо" lazy) User
      el-tab-pane(label="Тарифы" lazy) Тарифы
      el-tab-pane(label="Финансы" lazy) Финансы
      el-tab-pane(label="История задач" lazy) История задач
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import CustomerForm from '@/views/customers/customer-form.vue'

@Component({
  name: 'Info',
  components: { CustomerForm }
})
export default class extends Vue {}
</script>
