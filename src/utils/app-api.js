import axios from "axios";

export const app_api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token")
  }
});

app_api.interceptors.response.use(
  function(response) {
    return response;
  },

  function(error) {
    if (error.response.status == 4000) {
      app_api
        .post("/login/refresh/", { token: localStorage.getItem("refresh") })
        .then(res => {
          console.log(res);
          if (res.data.access_token && res.data.refresh_token) {
            localStorage.setItem("token", res.data.access_token);
            localStorage.setItem("refresh", res.data.refresh_token);
            return res;
          }
        });
    } else {
      console.log("App error");
      return Promise.reject(error);
    }
  }
);
