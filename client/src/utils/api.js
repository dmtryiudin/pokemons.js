import { LOCAL_STORAGE_TOKEN, USER_STORAGE } from "../types/consts";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const errorCode = error?.response?.data?.code;

    if (errorCode === 401) {
      localStorage.removeItem(USER_STORAGE);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN);

      window.location.href = `/auth?callback=${encodeURI(
        window.location.pathname
      )}`;
    } else {
      return Promise.reject(error);
    }
  }
);
