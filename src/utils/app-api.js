import axios from "axios";
import Store from "src/store/index";
import router from "src/router/index";
export const app_api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});

app_api.interceptors.response.use(
  function(response) {
    return response;
  },

  function(error) {
    console.log(error);
    if (error.response.status == 401) {
      Store.dispatch("logout");
      router.push("/login");
    } else {
      return Promise.reject(error);
    }
  }
);
