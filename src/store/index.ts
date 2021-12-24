import Vue from 'vue'
import Vuex from 'vuex'
import { config } from 'vuex-module-decorators'

config.rawError = true

import { IAppState } from './modules/app'
import { IUserProfile } from '@/api/profiles/types'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserProfile
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
