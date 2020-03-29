import Vue from "vue";
import axios from "axios";

import Store from "src/store";
import { app_api } from "src/utils/app-api";

export const spotify_api = axios.create({
  baseURL: "https://api.spotify.com/v1"
});

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token));
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

spotify_api.interceptors.request.use(
  config => {
    if (
      Store.getters.spotifyToken != undefined &&
      Store.getters.spotifyToken != null
    ) {
      config.headers["Authorization"] = "Bearer " + Store.getters.spotifyToken;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

spotify_api.interceptors.response.use(
  function(response) {
    return response;
  },

  async function(error) {
    const originalRequest = error.config;
    if (error.response.status == 401) {
      if (
        Store.getters.spotifyToken != undefined &&
        Store.getters.spotifyToken != null
      ) {
        if (!isAlreadyFetchingAccessToken) {
          const refreshToken = Store.getters.spotifyRefresh;
          isAlreadyFetchingAccessToken = true;
          const refresh = await app_api.post("/spotify/refresh", {
            token: refreshToken
          });

          isAlreadyFetchingAccessToken = false;
          onAccessTokenFetched(refresh.data.access_token);
          const data = {
            access_token: refresh.data.access_token,
            refresh_token: refreshToken
          };

          Store.dispatch("linkSpotify", data);
        }
      } else {
        return Promise.reject({ error: "No spotify token set" });
      }

      const retryOriginalRequest = new Promise(resolve => {
        addSubscriber(access_token => {
          originalRequest.headers.Authorization = "Bearer " + access_token;
          resolve(axios(originalRequest));
        });
      });
      return retryOriginalRequest;
    }

    return Promise.reject(error);
  }
);
Vue.prototype.$spotify = spotify_api;
