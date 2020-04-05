<template lang="pug">
  el-card(shadow="never")
    .clearfix(slot='header')
      span Сетевое
    span Ip адрес: ---
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { CustomerModule } from '@/store/modules/customers/customer'

@Component({
  name: 'Network'
})
export default class extends Vue {}
</script>