import axios from "axios";
import { getToken } from "./auth/token";

console.log("API_BASE_URL:", process.env.EXPO_PUBLIC_API_BASE_URL);

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL!,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT! || "10000")
});

api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export async function getUser(token: string) {
    const res = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return res.data;
  }

