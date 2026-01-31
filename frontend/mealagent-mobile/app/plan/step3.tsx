import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlanWizard } from "@/context/planWizard";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from "react-native";


export default function PlanStep3() {
    const { result } = usePlanWizard();
    const router = useRouter();

    if (!result) {
        <ThemedView style={styles.center}>
            <ActivityIndicator size="large" />
            <ThemedText>No plan yet. Go back and pick a recipe.</ThemedText>
        </ThemedView>
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.h1}>Grocery List</ThemedText>
            <ThemedText style={styles.sub}>For: {result?.title}</ThemedText>

            <ThemedText style={styles.section}>Missing ingredients</ThemedText>
            {result?.ingredientsMissing.length === 0 ? (
                <ThemedText>Nothing! You have enverything 🎉</ThemedText>
            ) : (
                <ScrollView>
                    {
                        result?.ingredientsMissing.map((value, i) => (
                            <ThemedText key={i}>• {value}</ThemedText>
                        ))
                    }
                </ScrollView>
            )}

            <Pressable onPress={() => router.push("/plan/step4")} style={styles.primaryBtn}>
                <ThemedText style={styles.primaryBtnText}>Start cooking</ThemedText>
            </Pressable>
            <Pressable onPress={() => router.push("/plan/step2")} style={styles.secondaryBtn}>
                <ThemedText style={styles.secondaryBtnText}>Back</ThemedText>
            </Pressable>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, gap: 10 },
    h1: { fontSize: 22, fontWeight: "700" },
    sub: { color: "#555" },
    section: { marginTop: 10, fontWeight: "700" },
    primaryBtn: { marginTop: 16, backgroundColor: "#2E7D32", padding: 14, borderRadius: 10, alignItems: "center" },
    primaryBtnText: { color: "#fff", fontWeight: "700" },
    secondaryBtn: { marginTop: 10, padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#ccc" },
    secondaryBtnText: { fontWeight: "700" },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
});