import axios from "axios";
import Store from "../store/index";

export const app_api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});

app_api.interceptors.request.use(
  config => {
    config.headers.Authorization = "Bearer " + Store.getters.token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

app_api.interceptors.response.use(
  function(response) {
    return response;
  },

  function(error) {
    if (error.response.status == 4000) {
      app_api
        .post("/login/refresh/", { token: localStorage.getItem("refresh") })
        .then(res => {
          if (res.data.access_token && res.data.refresh_token) {
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("refresh", res.data.refresh_token);
            return res;
          }
        });
    } else {
      return Promise.reject(error);
    }
  }
);
