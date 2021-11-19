<template lang="pug">
  tasks-index
    template(v-slot:tasklistnew)
      | asdasd
    template(v-slot:tasklistfin)
      | asd
    template(v-slot:tasklistfailed)
      | asd
    template(v-slot:tasklistall)
      | asd
    template(v-slot:tasklistallnew)
      | asd

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TasksIndex from '@/views/tasks/index.vue'

@Component({
  name: 'TasksWFinishingIndex',
  components: {
    TasksIndex
  }
})
export default class extends Vue {}
</script>
