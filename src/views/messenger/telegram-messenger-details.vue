<template lang="pug">
  h1 Telegram
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'TelegramMessengerDetails'
})
export default class extends Vue {
  @Prop({ required: true }) private mId!: number
}
</script>
