import axios from "axios";
import Store from "../store";

export const app_api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + Store.getters.token
  }
});

app_api.interceptors.response.use(
  function(response) {
    return response;
  },

  function(error) {
    console.log("App error");
    return Promise.reject(error);
  }
);
