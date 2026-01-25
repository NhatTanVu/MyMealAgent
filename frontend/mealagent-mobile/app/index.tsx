import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>🍳 Meal Agent</ThemedText>
            <ThemedText style={styles.subtitle}>
                Your AI-powered cooking assistant
            </ThemedText>

            {/* Link to /import */}
            <Link href="/import" asChild>
                <Pressable style={styles.button}>
                    <ThemedText style={styles.buttonText}>Import a Recipe</ThemedText>
                </Pressable>
            </Link>
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
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});