import Vue from "vue";
import Vuex from "vuex";
import { app_api } from "src/utils/app-api";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";

Vue.use(Vuex);

app_api.defaults.xsrfCookieName = "csrftoken";
app_api.defaults.xsrfHeaderName = "X-CSRFToken";

const Store = new Vuex.Store({
  state: {
    status: "",
    expires_in: null,
    token: null,
    refresh: null,
    auth: false,
    sauth: false,
    spotify_token: null,
    spotify_refresh: null,
    user: {},
    sUser: {}
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          // Set secure to true in prod!!!
          Cookies.set(key, value, {
            expires: 3,
            secure: window.webpackHotUpdate ? false : true
          }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    link_spotify(state, tokens) {
      state.spotify_token = tokens.token;
      state.spotify_refresh = tokens.refresh;
      state.sauth = true;
    },
    clear_spotify(state) {
      state.spotify_token = null;
      state.spotify_refresh = null;
      state.sauth = false;
    },
    auth_success(state, token) {
      state.status = "success";
      state.auth = true;
      state.token = token;
    },
    set_user(state, user) {
      state.user = user;
    },
    set_spotify(state, user) {
      state.sUser = user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.auth = false;
    }
  },
  actions: {
    login({ commit }, authData) {
      commit("auth_success", authData.data.tokenAuth.token);
      return true;
    },
    linkSpotify({ commit }, data) {
      console.log(data);
      commit("link_spotify", {
        token: data.access_token,
        refresh: data.refresh_token
      });
      return true;
    },
    tempAuth({ commit }) {
      commit("auth_success", null, null, null);
    },
    clearSpotify({ commit }) {
      commit("clear_spotify");
    },
    refresh({ commit }, refresh) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        app_api({
          url: "/api/token/refresh/",
          data: { refresh: refresh },
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.access;
            commit("auth_success", token);
            resolve(resp);
          })
          .catch(err => {
            commit("auth_error");
            console.log(err);
            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise(resolve => {
        commit("logout");
        commit("clear_spotify");
        resolve();
      });
    }
  },
  getters: {
    isLoggedIn: state => state.auth,
    isLinked: state => state.spotify_refresh,
    authStatus: state => state.status,
    token: state => state.token,
    spotifyToken: state => state.spotify_token,
    spotifyRefresh: state => state.spotify_refresh,
    user: state => state.user,
    sUser: state => state.sUser
  }

  // enable strict mode (adds overhead!)
  // for dev mode only
  //strict: process.env.DEV
});

export default Store;
