import axios from "axios";
import Store from "src/store";
import { app_api } from "./app-api";

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
    if (Store.getters.spotifyToken != undefined) {
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

  function(error) {
    const originalRequest = error.config;
    if (error.response.status == 401) {
      if (!isAlreadyFetchingAccessToken) {
        isAlreadyFetchingAccessToken = true;
        //Store.dispatch("clearSpotify");
        app_api
          .post("/spotify/refresh", { token: Store.getters.spotifyRefresh })
          .then(res => {
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(res.data.access_token);
            const data = {
              access_token: res.data.access_token,
              refresh_token: Store.getters.refresh_token
            };

            app_api
              .put("/users/" + Store.getters.user.id + "/spotify/", data)
              .then(() => {
                Store.dispatch("linkSpotify").then(() => {});
              });
          });
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
