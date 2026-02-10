import { Stack } from "expo-router";

export default function AppLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "My Meal Agent", headerShown: false }} />
            <Stack.Screen name="import/index" options={{ title: "Import Recipe" }} />
            <Stack.Screen name="recipes/index" options={{ title: "Recipes" }} />
            <Stack.Screen name="plan" options={{ title: "Plan", headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />            
        </Stack>
    );    
}