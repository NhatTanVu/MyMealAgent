import { ThemedText } from "@/components/themed-text";
import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";

export default function AppLayout() {
    const router = useRouter();

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "My Meal Agent", headerShown: false }} />
            <Stack.Screen name="import/index" options={{ title: "Import Recipe" }} />
            <Stack.Screen name="recipes/index" options={{
                title: "Recipes",
                headerLeft: () => (
                    <Pressable style={{ paddingLeft: 12, paddingRight: 12 }}  onPress={() => router.replace("/")}>
                        <ThemedText>My Meal Agent</ThemedText>
                    </Pressable>
                ),
            }} />
            <Stack.Screen
                name="recipe/[id]"
                options={{
                    headerLeft: () => (
                        <Pressable style={{ paddingLeft: 12, paddingRight: 12 }} onPress={() => router.replace("/recipes")}>
                            <ThemedText>Recipes</ThemedText>
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen name="plan" options={{ title: "Plan", headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="upgrade/index" options={{ title: "Upgrade Account" }} />
        </Stack>
    );
}