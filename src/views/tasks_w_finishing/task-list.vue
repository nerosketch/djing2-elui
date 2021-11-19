<template lang="pug">
  task-list
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TaskList from '@/views/tasks/task-list.vue'

@Component({
  name: 'TaskListWF',
  components: {
    TaskList
  }
})
export default class extends Vue {}
</script>
