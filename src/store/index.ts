import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserProfile } from '@/api/profiles/types'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserProfile
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
