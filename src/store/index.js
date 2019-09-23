import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
        playlistId: ""
      },
      mutations: {
        CHANGE_PLAYLIST: (state, playlistId) => {
            state.playlistId = playlistId;
        }
      },
      actions: {
        
        },
      getters: {
        playlistId: state => state.playlistId
      },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}