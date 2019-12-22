import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import router from "../router/routes";

Vue.use(Vuex);

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

const Store = new Vuex.Store({
  state: {
    playlistId: "",
    status: "",
    expires_in: null,
    token: localStorage.getItem("token") || "",
    auth: localStorage.getItem("token") || false,
    spotify_token: localStorage.getItem("stoken") || ""
  },
  mutations: {
    CHANGE_PLAYLIST: (state, playlistId) => {
      state.playlistId = playlistId;
    },
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, token, exp) {
      state.status = "success";
      state.token = token;
      state.expires_in = exp;
      state.auth = true;
      localStorage.setItem("token", token);
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.auth = false;
      localStorage.removeItem("token");
    }
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "http://localhost:8000/login/",
          data: user,
          method: "POST"
        })
          .then(resp => {
            const token = resp.data.access_token;
            const refresh = resp.data.refresh_token;
            const exp = resp.data.expires_in;
            localStorage.setItem("refresh", refresh);
            commit("auth_success", token, exp);
            resolve();
          })
          .catch(error => {
            commit("auth_error");
            console.error(error);
            reject(error);
          });
      });
    },
    inspect() {
      const token = this.state.token;
      if (token) {
        const exp = this.expires_in;
        // if token expires in 30 minutes and is not reaching lifespan
        if (exp - Date.now() / 1000 < 1800) {
          //token expires soon refresh
          this.dispatch("refresh", localStorage.getItem("refresh"));
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
        axios({
          url: "http://localhost:8000/api/token/refresh/",
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
        router.push({ path: "login" });
        resolve();
      });
    }
  },
  getters: {
    playlistId: state => state.playlistId,
    isLoggedIn: state => state.auth,
    authStatus: state => state.status,
    token: state => state.token,
    stoken: state => state.spotify_token
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
});

export default Store;
