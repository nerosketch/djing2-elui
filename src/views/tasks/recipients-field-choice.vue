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


export const loadPotentialRecipients = async () => {
  const { data } = await getActiveProfiles({
    page: 1,
    page_size: 0,
    fields: 'id,full_name,username'
  })
  return data
}

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
  async onChRecs(recs: IUserProfile[]) {
    if (recs.length > 0)
      this.potentialRecipients = recs
    else
      this.potentialRecipients = await loadPotentialRecipients()
  }

  @Watch('value')
  private OnChVal(selectedVals: number[]) {
    this.localRecipients = selectedVals
  }

  @Watch('localRecipients')
  private onSelectRecipients(recs: number[]) {
    this.$emit('input', recs)
  }

  async created() {
    this.localRecipients = this.value

    if (this.recipients.length > 0)
      this.potentialRecipients = this.recipients
    else
      await loadPotentialRecipients().then(recs => {
        this.potentialRecipients = recs
      })
  }
}
</script>
