import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { api } from "../api";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
    const isExpoGo = Constants.executionEnvironment === "storeClient";
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "mymealagent",
        path: "oauthredirect",
        useProxy: isExpoGo,
    });

    const [request, , promptAsync] = Google.useAuthRequest({
        expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        redirectUri,
        scopes: ["openid", "profile", "email"],
    });

    const loginWithGoogle = async () => {
        const result = await promptAsync(isExpoGo ? { useProxy: true } : undefined);

        if (result.type !== "success") {
            throw new Error("Google login cancelled");
        }

        const idToken = result.authentication?.idToken;

        if (!idToken) {
            throw new Error("No Google ID token returned");
        }

        const res = await api.post("/auth/google", {
            id_token: idToken,
        });

        return res.data.access_token as string;
    };

    return { loginWithGoogle, request };
}
