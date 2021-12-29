import { Component, Vue } from 'vue-property-decorator'
import { getActiveProfiles } from '@/api/profiles/req'
import { IUserProfile } from '@/api/profiles/types'

@Component({
  name: 'TaskMixin'
})
export default class extends Vue {
  protected potentialRecipients: IUserProfile[] = []

  protected async loadPotentialRecipients() {
    const { data } = await getActiveProfiles({
      page: 1,
      page_size: 0,
      fields: 'id,full_name,username'
    })
    this.potentialRecipients = data
  }
}
