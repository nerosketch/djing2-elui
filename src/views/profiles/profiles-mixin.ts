import { Component, Vue } from 'vue-property-decorator'
import { CurrentUserProfileModule } from '@/store/modules/profiles/current-user-profile'

@Component({
  name: 'ProfilesMixin'
})
export default class extends Vue {

  public get isProfileSuperUser(): boolean {
    return CurrentUserProfileModule.is_superuser
  }
}
