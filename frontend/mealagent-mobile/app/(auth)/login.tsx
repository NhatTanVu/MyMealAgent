import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/useAuth";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput } from "react-native";

export default function LoginScreen() {
    const { login, loginGoogle, loginApple } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [appleAvailable, setAppleAvailable] = useState(false);

    useEffect(() => {
        if (Platform.OS !== "ios") return;

        AppleAuthentication.isAvailableAsync()
            .then(setAppleAvailable)
            .catch(() => setAppleAvailable(false));
    }, []);

    const onLogin = async () => {
        try {
            setLoading(true);
            setError(null);
            await login(username, password);
            router.replace("/");
        } catch (e: any) {
            setError(e?.response?.data?.detail ?? "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const onGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            await loginGoogle();
            router.replace("/");
        } catch (e: any) {
            setError(e.message ?? "Google login failed");
        } finally {
            setLoading(false);
        }
    };

    const onApple = async () => {
        try {
            setLoading(true);
            setError(null);
            await loginApple();
            router.replace("/");
        } catch (e: any) {
            setError(e.message ?? "Apple login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView keyboardShouldPersistTaps="handled" style={{ padding: 24 }}>
                <ThemedText style={{ 
                    fontSize: 28, 
                    fontWeight: "600", 
                    marginBottom: 16,
                    lineHeight: 34 }}>
                    Welcome back
                </ThemedText>

                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
                />

                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
                />

                {error && <ThemedText style={{ color: "red", marginBottom: 8 }}>{error}</ThemedText>}

                <Pressable
                    onPress={onLogin}
                    disabled={loading}
                    style={{
                        backgroundColor: "#000",
                        padding: 14,
                        borderRadius: 6,
                        alignItems: "center",
                    }}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <ThemedText style={{ color: "#fff", fontWeight: "600" }}>Login</ThemedText>
                    )}
                </Pressable>

                {/* Divider */}
                <ThemedText style={{ textAlign: "center", marginVertical: 12, color: "#666" }}>
                    OR
                </ThemedText>

                {/* Apple (iOS only) */}
                {appleAvailable && (
                    <AppleAuthentication.AppleAuthenticationButton
                        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                        cornerRadius={6}
                        style={{ height: 44, marginBottom: 16 }}
                        onPress={onApple}
                    />
                )}

                {/* Google */}
                <Pressable
                    onPress={onGoogle}
                    style={{
                        borderWidth: 1,
                        padding: 14,
                        borderRadius: 6,
                        marginBottom: 12,
                        alignItems: "center",
                    }}
                >
                    <ThemedText style={{ fontWeight: "500" }}>Continue with Google</ThemedText>
                </Pressable>

                <Link href="/register" style={{ marginTop: 16, fontSize: 16 }}>
                    Don’t have an account? Register
                </Link>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
