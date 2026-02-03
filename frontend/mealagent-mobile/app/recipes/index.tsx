import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/services/api';
import { RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';

type Recipe = {
    id: number;
    title: string;
    ingredients: string[];
    steps: string[];
    cook_time: number | undefined;
    servings: number | undefined;
    source_url: string;
}

export default function RecipeListScreen() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get("/recipes/")
            .then((res) => setRecipes(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.center}>
                <ActivityIndicator size="large" />
                <ThemedText>Loading recipes...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <FlatList
            data={recipes}
            keyExtractor={(item) => item.id as unknown as string}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
                <Pressable
                    style={styles.card}
                    onPress={() => router.push(`/recipe/${item.id}` as RelativePathString)}>
                    <ThemedText style={styles.title}>{item.title}</ThemedText>
                </Pressable>
            )}
        />
    )
};

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    list: {
        padding: 16,
    },
    card: {
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "600"
    }
});