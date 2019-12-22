import axios from "axios";
import Store from "../store";
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
    if (error.response.status == 401) {
      Store.dispatch("linkSpotify");
    }
  }
);
