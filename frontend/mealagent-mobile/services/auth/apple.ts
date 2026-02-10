import * as AppleAuthentication from "expo-apple-authentication";
import { api } from "../api";


export async function loginWithApple() {
    const cred = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME
        ]
    });

    if (!cred.identityToken) throw new Error("Missing Apple identity token");

    const res = await api.post("/auth/apple", { identity_token: cred.identityToken });
    return res.data.access_token as string;
}