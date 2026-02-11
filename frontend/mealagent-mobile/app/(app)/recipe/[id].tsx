import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { api } from "@/services/api";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet } from "react-native";


type RecipeDetail = {
    id: number;
    title: string;
    ingredients: string[];
    steps: string[];
}

export default function RecipeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadRecipe = async () => {
            api.get(`/recipes/${id}`)
                .then(res => {
                    setRecipe(res.data);
                })
                .catch((reason) => Alert.alert("Error", "Unable to load recipe"))
                .finally(() => setLoading(false))
        };

        loadRecipe();
    }, [id]);

    const navigation = useNavigation();

    useEffect(() => {
        if (recipe?.title) {
            navigation.setOptions({
                title: recipe.title
            })
        }
    }, [recipe]);

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator size="large" />
                <ThemedText>Loading recipe...</ThemedText>
            </ThemedView>
        )
    }

    if (!recipe) {
        return (
            <ThemedView style={styles.center}>
                <ThemedText>Recipe not found</ThemedText>
            </ThemedView>
        )
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Title */}
            <ThemedText style={styles.title}>{recipe.title}</ThemedText>
            {/* Ingredients */}
            <ThemedText style={styles.section}>🧺 Ingredients</ThemedText>
            {recipe.ingredients.map((item, index) => (
                <ThemedText key={index} style={styles.item}>• {item}</ThemedText>
            ))}
            {/* Steps */}
            <ThemedText style={styles.section}>👩‍🍳 Steps</ThemedText>
            {recipe.steps.map((item, index) => (
                <ThemedText key={index} style={styles.step}>{index + 1}. {item}</ThemedText>
            ))}
            <ThemedView style={{ marginTop: 24 }}>
                <Pressable style={styles.secondaryBtn} onPress={() => router.replace("/recipes")}>
                    <ThemedText style={styles.secondaryBtnText}>← Back to Recipes</ThemedText>
                </Pressable>
            </ThemedView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        lineHeight: 32, // fontSize * 1.2
        fontWeight: "bold",
        marginBottom: 16,
    },
    section: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 24,
        marginBottom: 8,
    },
    item: {
        fontSize: 15,
        marginVertical: 2,
    },
    step: {
        fontSize: 15,
        marginBottom: 8,
        lineHeight: 22
    },
    secondaryBtn: {
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc"
    },
    secondaryBtnText: {
        fontWeight: "700"
    },
});