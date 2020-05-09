import axios from "axios";
export const app_api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 100000,
  headers: {
    "Content-Type": "application/json"
  }
});
