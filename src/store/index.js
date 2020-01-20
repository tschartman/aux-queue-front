import Vue from "vue";
import Vuex from "vuex";
import { app_api } from "../utils/app-api";
import createPersistedState from "vuex-persistedstate";
import * as Cookies from "js-cookie";

Vue.use(Vuex);

app_api.defaults.xsrfCookieName = "csrftoken";
app_api.defaults.xsrfHeaderName = "X-CSRFToken";

const Store = new Vuex.Store({
  state: {
    playlistId: "",
    status: "",
    expires_in: null,
    token: null,
    refresh: null,
    auth: false,
    sauth: false,
    spotify_token: null,
    spotify_refresh: null
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 3, secure: false }),
        removeItem: key => Cookies.remove(key)
      }
    })
  ],
  mutations: {
    CHANGE_PLAYLIST: (state, playlistId) => {
      state.playlistId = playlistId;
    },
    auth_request(state) {
      state.status = "loading";
    },
    link_spotify(state, tokens) {
      state.spotify_token = tokens.token;
      state.spotify_refresh = tokens.refresh;
    },
    clear_spotify(state) {
      state.spotifyToken = undefined;
      state.spotifyRefresh = undefined;
    },
    auth_success(state, token, exp, refresh) {
      state.status = "success";
      state.token = token;
      state.refresh = refresh;
      state.expires_in = exp;
      state.auth = true;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.spotify_token = "";
      state.auth = false;
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        app_api
          .post("/login/", user)
          .then(resp => {
            const token = resp.data.access_token;
            const refresh = resp.data.refresh_token;
            const exp = resp.data.expires_in;
            commit("auth_success", token, exp, refresh);
            resolve();
          })
          .catch(error => {
            commit("auth_error");
            console.error(error);
            reject(error);
          });
      });
    },
    linkSpotify({ commit }) {
      return new Promise((resolve, reject) => {
        return app_api.get("/users/").then(res => {
          return app_api
            .get("/users/" + res.data[0].id + "/spotify/")
            .then(res => {
              let token = res.data.access_token;
              let refresh = res.data.refresh_token;
              commit("link_spotify", { token: token, refresh: refresh });
              resolve(res);
            })
            .catch(error => {
              reject(error);
            });
        });
      });
    },
    tempAuth({ commit }) {
      commit("auth_success", null, null, null);
    },
    setSpotify({ commit }, token) {
      commit("link_spotify", { token: token, refresh: null });
      commit("auth_success", null, null, null);
    },
    clearSpotify({ commit }) {
      commit("clear_spotify");
    },
    inspect() {
      const token = this.state.token;
      if (token) {
        const exp = this.expires_in;
        // if token expires in 30 minutes and is not reaching lifespan
        if (exp - Date.now() / 1000 < 1800) {
          //token expires soon refresh
          this.dispatch("refresh", this.state.refresh);
          console.log("refreshed");
          // } else if (exp - Date.now() / 1000 < 1800) {
          //   // token refresh expires soon so logout
          //   this.dispatch("logout");
        } else {
          //token is good, do nothing
        }
      }
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
        resolve();
      });
    }
  },
  getters: {
    playlistId: state => state.playlistId,
    isLoggedIn: state => state.auth,
    isLinked: state => state.sauth,
    authStatus: state => state.status,
    token: state => state.token,
    spotifyToken: state => state.spotify_token,
    spotifyRefresh: state => state.spotify_refresh
  }

  // enable strict mode (adds overhead!)
  // for dev mode only
  //strict: process.env.DEV
});

export default Store;
