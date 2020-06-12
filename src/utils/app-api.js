import axios from "axios";
export const app_api = axios.create({
  baseURL: "https://auxstack.herokuapp.com/",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});
