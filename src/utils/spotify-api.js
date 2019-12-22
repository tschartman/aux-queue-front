import axios from "axios";
import Store from "../store";
import { app_api } from "./app-api";

export const spotify_api = axios.create({
  baseURL: "https://api.spotify.com/v1",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + Store.getters.spotifyToken
  }
});

spotify_api.interceptors.response.use(
  function(response) {
    return response;
  },

  function(error) {
    console.log(error);
    if (error.response.status == 401) {
      app_api
        .post("/spotify/refresh", { token: Store.getters.spotifyRefresh })
        .then(res => {
          const data = {
            access_token: res.data.access_token,
            refresh_token: Store.getters.refresh_token
          };

          localStorage.setItem("stoken", res.data.access_token);
          app_api.put("/users/1/spotify/", data).then(resp => {
            console.log(resp);
            console.log("renewed your spotify session!");
          });
        });
    }
  }
);
