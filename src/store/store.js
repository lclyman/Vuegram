import Vue from 'vue'
import Vuex from 'vuex'

import * as getters from './getters';
import * as actions from './actions';
import * as mutations from './mutations';
import { auth } from "../firebase/init"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts:[],
    postComments: [],
    fullPost: {},
    performingRequest:false,
    passwordResetSuccess: false,
    errMsg: ""
  },
  mutations,
  actions,
  getters
})
