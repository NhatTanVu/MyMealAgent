import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePlanWizard } from "@/context/planWizard";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlanStep1() {
    const insets = useSafeAreaInsets();
    const [ingredientText, setIngredientText] = useState("");
    const addIngredient = () => {
        const v = ingredientText.trim();
        if (!v) return;
        setInputs({
            ...inputs, ingredients: [...inputs.ingredients, {
                name: v.toLowerCase(),
                amount: 0,
                unit: ""
            }]
        });
        setIngredientText("");
    };
    const { inputs, setInputs } = usePlanWizard();
    const [timeText, setTimeText] = useState("");
    const removeIngredient = (idx: number) => {
        const newIngredients = inputs.ingredients.filter((_, i) => i !== idx);
        setInputs({ ...inputs, ingredients: newIngredients });
    }
    const [servingsText, setServingsText] = useState("");
    const router = useRouter();
    const next = () => {
        const timeAvailable = Math.max(1, parseInt(timeText || "30"));
        const servings = Math.max(1, parseInt(servingsText || "2"));
        setInputs({ ...inputs, timeAvailable, servings });
        router.push("/plan/step2");
    }

    console.log(`insets.bottom=${insets.bottom}`)

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ThemedView style={{ flex: 1, padding: 20 }}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <ThemedText style={styles.h1}>What's in your fridge?</ThemedText>

                    <ThemedView style={styles.row}>
                        <TextInput
                            value={ingredientText}
                            onChangeText={setIngredientText}
                            placeholder="e.g. chicken"
                            style={styles.input}
                            autoCapitalize="none"
                            onSubmitEditing={addIngredient}
                        />
                        <Pressable onPress={addIngredient} style={styles.addBtn}>
                            <ThemedText style={styles.addBtnText}>Add</ThemedText>
                        </Pressable>
                    </ThemedView>

                    <ThemedView style={styles.chips}>
                        {
                            inputs.ingredients.map((ing, idx) => (
                                <Pressable key={`${ing.name}-${idx}`} onPress={() => removeIngredient(idx)} style={styles.chip}>
                                    <ThemedText>{ing.name} ✕</ThemedText>
                                </Pressable>
                            ))
                        }
                    </ThemedView>

                    <ThemedText style={styles.label}>Time available (minutes)</ThemedText>
                    <TextInput value={timeText} onChangeText={setTimeText} keyboardType="number-pad" style={styles.inputFull} />

                    <ThemedText style={styles.label}>Servings</ThemedText>
                    <TextInput value={servingsText} onChangeText={setServingsText} keyboardType="number-pad" style={styles.inputFull} />
                </ScrollView>
            </ThemedView>
            <ThemedView style={{ marginBottom: Platform.OS !== "web" ? (insets.bottom + 60) : 0, padding: 20 }}>
                <Pressable onPress={() => router.push("/")} style={styles.secondaryBtn}>
                    <ThemedText style={styles.secondaryBtnText}>Back</ThemedText>
                </Pressable>
                <Pressable onPress={next} style={styles.primaryBtn}>
                    <ThemedText style={styles.primaryBtnText}>Next</ThemedText>
                </Pressable>
            </ThemedView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 20, gap: 12
    },
    h1: {
        fontSize: 22, fontWeight: "700"
    },
    row: {
        flexDirection: "row", gap: 10, alignItems: "center",
    },
    input: {
        flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12
    },
    addBtn: {
        backgroundColor: "#1565C0", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8
    },
    addBtnText: {
        color: "#fff", fontWeight: "600"
    },
    chips: {
        flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8
    },
    chip: {
        backgroundColor: "#f2f2f2", paddingVertical: 8, paddingHorizontal: 10, borderRadius: 999
    },
    label: {
        marginTop: 6, fontWeight: "600"
    },
    inputFull: {
        borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12
    },
    primaryBtn: {
        marginTop: 12, backgroundColor: "#2E7D32", padding: 14, borderRadius: 10, alignItems: "center"
    },
    primaryBtnText: { color: "#fff", fontWeight: "700" },
    secondaryBtn: {
        marginTop: 10, padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#ccc"
    },
    secondaryBtnText: {
        fontWeight: "700"
    },
});