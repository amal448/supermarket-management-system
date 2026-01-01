import axios from "axios";

export const api = axios.create({
  baseURL: "http://18.60.239.13", // IMPORTANT
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
