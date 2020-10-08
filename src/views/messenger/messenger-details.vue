<template lang="pug">
  h1 Messenger details
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'MessengerDetails'
})
export default class extends Vue {
  @Prop({ required: true }) private mId!: number
}
</script>
