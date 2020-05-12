<template lang="pug">
  el-card.box-card(
    v-loading='loading'
    shadow="never"
    body-style="padding: 10px;"
  )
    template(v-slot:header)
      slot(name="header")
        .clearfix(
          v-if='title'
        )
          span {{ title }}
    slot(name="items")
      .text.item.list-item(
        v-for="(it, i) in items"
        :key="i"
        :class="{'active': clickStates[i]}"
        v-on:click="itemClick(it, i)"
      )
        slot(name="item" v-bind:obj="it") {{ it[itemText] }}
    slot(name="footer")
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component({
  name: 'List'
})
export default class extends Vue {
  @Prop({ default: () => [] }) private items!: []
  @Prop({ default: null }) private title!: string | null
  @Prop({ default: false }) private loading!: boolean
  @Prop({ default: 'text' }) private itemText!: string
  @Prop({ default: false }) private isClickable!: boolean

  private clickStates: boolean[] = []
  private lastClickIndex?: number = undefined

  private itemClick(elem: any, i: number) {
    if (!this.isClickable) return
    this.clickStates.fill(false, 0, this.items.length)
    const isEqual = this.lastClickIndex === i
    this.$set(this.clickStates, i, !isEqual)
    this.lastClickIndex = isEqual ? undefined : i
    this.$emit('itemClick', elem, i)
  }

  @Watch('items')
  private onItemsChanged(items: []) {
    const ln = items.length
    this.clickStates = new Array(ln)
    this.clickStates.fill(false, 0, ln)
  }
}
</script>

<style>
.list-item {
  padding: 11px 13px;
  border: 1px solid #dfe6ec;
  border-bottom: none;
  font-size: smaller;
}
.list-item:last-child {
  border-bottom: 1px solid #dfe6ec;
}

.list-item:hover {
    background-color: #F5F7FA;
    transition: background-color 0.25s ease;
}

.list-item {
  cursor: pointer;
}

.list-item.active {
    background-color: #3376c8;
    color: white;
}
.list-item.active:hover {
  background-color: #5f9bf4;
}
</style>
