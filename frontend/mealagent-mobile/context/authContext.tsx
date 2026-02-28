import { getUser } from "@/services/api";
import { loginWithApple } from "@/services/auth/apple";
import { useGoogleLogin } from "@/services/auth/google";
import { clearToken, getToken, saveToken } from "@/services/auth/token";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/auth/authApi";

export type User = {
    id: number;
    email: string;
    username: string;
    plan: string;
    recipe_count: number;
};

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (u: string, p: string) => Promise<void>;
    register: (u: string, p: string, e?: string) => Promise<void>;
    loginGoogle: () => Promise<void>;
    loginApple: () => Promise<void>;
    logout: () => Promise<void>;
    user: User | null;
    reloadUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async (tokenToLoad: string) => {
        try {
            const userData = await getUser(tokenToLoad);
            setUser(userData);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                await clearToken();
                setToken(null);
                setUser(null);
                return;
            }
            throw error;
        }
    };

    useEffect(() => {
        getToken().then(async (storedToken) => {
            try {
                if (storedToken) {
                    setToken(storedToken);
                    await loadUser(storedToken);
                }
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const login = async (u: string, p: string) => {
        const t = await authApi.login(u, p);
        await saveToken(t);
        setToken(t);
        await loadUser(t);
    };

    const register = async (u: string, p: string, e?: string) => {
        const t = await authApi.register(u, p, e);
        await saveToken(t);
        setToken(t);
        await loadUser(t);
    };

    const logout = async () => {
        await clearToken();
        setToken(null);
        setUser(null);
    };

    const { loginWithGoogle } = useGoogleLogin();

    const loginGoogle = async () => {
        const t = await loginWithGoogle();
        await saveToken(t);
        setToken(t);
        await loadUser(t);
    };

    const loginApple = async () => {
        const t = await loginWithApple();
        await saveToken(t);
        setToken(t);
        await loadUser(t);
    };

    const reloadUser = async () => {
        if (token) {
            await loadUser(token);
        }
    };

    return (
        <AuthContext.Provider
            value={{ token, loading, login, register, logout, loginApple, loginGoogle, user, reloadUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("AuthContext missing");
    return ctx;
};
