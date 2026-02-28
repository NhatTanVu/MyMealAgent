import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { api } from "../api";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleLogin() {
    const [request, , promptAsync] = Google.useIdTokenAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
    });

    const loginWithGoogle = async () => {
        const result = await promptAsync();

        if (result.type !== "success") {
            throw new Error("Google login cancelled");
        }

        let idToken =
            ("params" in result && typeof result.params?.id_token === "string"
                ? result.params.id_token
                : undefined) ?? result.authentication?.idToken;

        const authCode =
            "params" in result && typeof result.params?.code === "string"
                ? result.params.code
                : undefined;

        if (!idToken && authCode && request?.codeVerifier) {
            const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

            if (!webClientId) {
                throw new Error("Google web client ID is not configured");
            }

            const tokenResponse = await AuthSession.exchangeCodeAsync(
                {
                    clientId: webClientId,
                    code: authCode,
                    redirectUri: request.redirectUri,
                    extraParams: { code_verifier: request.codeVerifier },
                },
                Google.discovery
            );

            idToken = tokenResponse.idToken ?? undefined;
        }

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
