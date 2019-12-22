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
    console.log("App error");
    return Promise.reject(error);
  }
);
