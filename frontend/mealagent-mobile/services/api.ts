import axios from "axios";

console.log("API_BASE_URL:", process.env.EXPO_PUBLIC_API_BASE_URL);

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL!,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT! || "10000")
});