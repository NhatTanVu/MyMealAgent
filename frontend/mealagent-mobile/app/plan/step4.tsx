import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlanWizard } from "@/context/planWizard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function PlanStep4() {
    const { result, reset } = usePlanWizard();
    const router = useRouter();
    const [idx, setIdx] = useState(0);

    if (!result) {
        return (
            <ThemedView style={styles.center}>
                <ThemedText>No recipe selected.</ThemedText>
            </ThemedView>
        );
    }

    const step = result.steps[idx];
    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.h1}>Cook: {result.title}</ThemedText>
            <ThemedText style={styles.progress}>Step {idx + 1} / {result.steps.length}</ThemedText>
            <ThemedView style={styles.card}>
                <ThemedText style={styles.stepText}>{step}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.row}>
                <Pressable
                    onPress={() => setIdx((v) => Math.max(0, v - 1))}
                    style={[styles.btn, styles.secondary]}
                    disabled={idx === 0}
                >
                    <ThemedText>Back</ThemedText>
                </Pressable>
                <Pressable
                    onPress={() => setIdx((v) => Math.min(result.steps.length - 1, v + 1))}
                    style={[styles.btn, styles.primary]}
                    disabled={idx === result.steps.length - 1}
                >
                    <ThemedText style={[styles.btnText, { color: "#fff" }]}>Next</ThemedText>
                </Pressable>
            </ThemedView>
            <Pressable onPress={
                () => {
                    reset();
                    router.replace("/recipes");
                }
            } style={styles.finishBtn}>
                <ThemedText style={styles.finishText}>Finish • Back to recipes</ThemedText>
            </Pressable>
        </ThemedView >
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1, alignItems: "center", justifyContent: "center"
    },
    container: {
        flex: 1, padding: 20, gap: 12
    },
    h1: {
        fontSize: 20, fontWeight: "800"
    },
    progress: {
        color: "#666"
    },
    card: {
        flex: 1, backgroundColor: "#f5f5f5", padding: 16, borderRadius: 12, justifyContent: "center"
    },
    stepText: {
        fontSize: 18, lineHeight: 26
    },
    row: {
        flexDirection: "row", gap: 10
    },
    btn: {
        flex: 1, padding: 14, borderRadius: 10, alignItems: "center"
    },
    btnText: {
        fontWeight: "800"
    },
    secondary: {
        borderWidth: 1, borderColor: "#ccc"
    },
    primary: {
        backgroundColor: "#2E7D32"
    },
    finishText: {
        color: "#fff", fontWeight: "800"
    },
    finishBtn: {
        padding: 14, borderRadius: 10, alignItems: "center", backgroundColor: "#1565C0"
    }
});