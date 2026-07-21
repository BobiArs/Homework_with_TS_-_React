import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://jsonplaceholder.typicode.com";

export const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
