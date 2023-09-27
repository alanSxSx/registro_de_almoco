// axiosConfig.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; // URL base da sua API

axios.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log(`TESTE ${authToken}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
