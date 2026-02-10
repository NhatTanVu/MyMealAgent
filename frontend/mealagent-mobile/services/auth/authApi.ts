import { api } from "../api";

export async function register(username: string, password: string, email?: string) {
    const res = await api.post("/auth/register", { username, password, email });
    return res.data.access_token as string;
}

export async function login(username: string, password: string) {
    const res = await api.post("/auth/login", { username, password });
    return res.data.access_token as string;
}