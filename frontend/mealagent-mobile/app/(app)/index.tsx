import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/hooks/useAuth";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
    const { token, loading, logout } = useAuth();
    const router = useRouter();

    const onLogout = async () => {
        await logout();
        router.replace("/(auth)/login");
    };

    useEffect(() => {
        if (!loading && !token) {
            router.replace("/login");
        }
    }, [loading, token]);

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>🍳 My Meal Agent</ThemedText>
            <ThemedText style={styles.subtitle}>
                Your AI-powered cooking assistant
            </ThemedText>

            {/* Link to /import */}
            <Link href="/import" asChild style={{ fontSize: 16 }}>
                <Pressable style={styles.button}>
                    <ThemedText style={styles.buttonText}>Import a Recipe</ThemedText>
                </Pressable>
            </Link>

            {/* Link to /recipes */}
            <Link href="/recipes" asChild style={{ fontSize: 16 }}>
                <Pressable style={styles.button}>
                    <ThemedText style={styles.buttonText}>View all Recipes</ThemedText>
                </Pressable>
            </Link>

            <Link href="/plan/step1" asChild style={{ fontSize: 16 }}>
                <Pressable style={styles.button}>
                    <ThemedText style={styles.buttonText}>Smart Plan Wizard</ThemedText>
                </Pressable>
            </Link>

            <Pressable style={[styles.button, styles.logoutButton]}
                onPress={onLogout}>
                <ThemedText style={styles.buttonText}>Logout</ThemedText>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        lineHeight: 34, // fontSize * 1.2
        marginBottom: 8,
    },
    subtitle: {
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#2E7D32",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 14,
        minWidth: 200
    },
    logoutButton: {
        backgroundColor: "#000",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center"
    },
});