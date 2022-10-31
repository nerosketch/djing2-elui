<template lang="pug">
el-select(
  v-model="localRecipients"
  multiple
)
  el-option(
    v-for="rec in potentialRecipients"
    :key="rec.id"
    :label="rec.full_name || rec.username"
    :value="rec.id")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getActiveProfiles } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'

@Component({
  name: 'RecipientsFieldChoice'
})
export default class extends Vue {
  @Prop({ default: () => [] })
  private recipients!: IUserProfile[]

  @Prop({ required: true })
  private value!: number[]

  private potentialRecipients: IUserProfile[] = []

  private localRecipients: number[] = []

  @Watch('recipients')
  private onChRecs(recs: IUserProfile[]) {
    this.potentialRecipients = recs
  }

  @Watch('value')
  private OnChVal(selectedVals: number[]) {
    this.localRecipients = selectedVals
  }

  @Watch('localRecipients')
  private onSelectRecipients(recs: number[]) {
    this.$emit('input', recs)
  }

  protected async loadPotentialRecipients() {
    const { data } = await getActiveProfiles({
      page: 1,
      page_size: 0,
      fields: 'id,full_name,username'
    })
    this.potentialRecipients = data
  }

  created() {
    this.potentialRecipients = this.recipients
    this.localRecipients = this.value
  }
}
</script>
