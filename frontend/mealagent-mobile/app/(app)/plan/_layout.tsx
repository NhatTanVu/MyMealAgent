import { PlanWizardProvider } from "@/context/planWizard";
import { Stack } from "expo-router";


export default function PlayLayout() {
    return (
        <PlanWizardProvider>
            <Stack screenOptions={{
                headerBackVisible: false, // hides arrow (Android)
                headerLeft: () => null,   // force-remove left header
                gestureEnabled: false,    // disables iOS swipe back
            }}>
                <Stack.Screen name="step1" options={{ title: "Plan • Step 1/4" }} />
                <Stack.Screen name="step2" options={{ title: "Plan • Step 2/4" }} />
                <Stack.Screen name="step3" options={{ title: "Plan • Step 3/4" }} />
                <Stack.Screen name="step4" options={{ title: "Plan • Step 4/4" }} />
            </Stack>
        </PlanWizardProvider>
    );
}