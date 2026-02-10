import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { api } from "../api";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
    });

    const loginWithGoogle = async () => {
        const result = await promptAsync();

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
