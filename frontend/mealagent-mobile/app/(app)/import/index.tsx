import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useBilling } from '@/context/purchaseProvider';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { showPaywall } from '@/services/billing/paywall';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import ImportNotice from './import-notice';

export default function ImportRecipeScreen() {
    const [youtubeUrl, setYouTubeUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [focused, setFocused] = useState(false);
    const [importId, setImportId] = useState("");
    const { user, reloadUser } = useAuth();
    const { isPremium } = useBilling();

    const pickImageAndUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const res_image = result.assets[0];
                let formData = new FormData();
                try {
                    const res_blob = await fetch(res_image.uri)
                    const blobData = await res_blob.blob()
                    let fileOfBlob = new File([blobData], 'recipe.jpeg', { type: 'image/jpeg' });
                    formData.append("image", fileOfBlob);
                }
                catch (_) {
                    formData.append("image", {
                        uri: res_image.uri,
                        name: "recipe.jpg",
                        type: "image/jpeg",
                    } as any);
                }

                try {
                    setLoading(true);
                    setFocused(true);
                    const res = await api.post("/recipes/imports", formData);

                    const data = await res.data["import_id"];
                    setImportId(data);
                }
                catch (err: any) {
                    Alert.alert("Error", err.message || "Failed to import image");
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Error picking or uploading image:", error);
        }
    };

    const submitVideoUrl = async () => {
        if (!youtubeUrl.trim()) {
            Alert.alert("Error", "Please enter a YouTube URL");
            return;
        }

        try {
            setLoading(true);
            setFocused(true);
            const formData = new FormData();
            formData.append("source_url", youtubeUrl.trim());
            const res = await api.post("/recipes/imports", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = await res.data["import_id"];
            setImportId(data);
        }
        catch (err: any) {
            Alert.alert("Error", err.message || "Failed to import from YouTube");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (importId != "") {
            const poll = setInterval(async () => {
                try {
                    const res = await api.get(`/recipes/imports/${importId}/status`);
                    const data = await res.data;

                    if (data["status"] === "completed") {
                        clearInterval(poll);
                        Alert.alert("Success", "Recipe imported!");
                        const recipe_id = data["recipe"]["id"]
                        router.push(`/recipe/${recipe_id}`)
                        setLoading(false);
                    } else if (data["status"] === "failed") {
                        clearInterval(poll);
                        Alert.alert("Error", data["error"] || "Failed to import");
                        setLoading(false);
                    }
                }
                catch (err: any) {
                    Alert.alert("Error", err.message || "Failed to import");
                    setLoading(false);
                }
            }, 2000);
        }
    }, [importId]);

    useEffect(() => {
        async function checkLimit() {
            if (!isPremium && user!.recipe_count >= parseInt(process.env.EXPO_PUBLIC_PREMIUM_RECIPE_COUNT_LIMIT!)) {
                Alert.alert(
                    "Upgrade Required",
                    `Free plan allows maximum ${process.env.EXPO_PUBLIC_PREMIUM_RECIPE_COUNT_LIMIT} recipes. Upgrade to Premium for unlimited imports.`,
                    [{
                        text: "Upgrade", onPress: () => {
                            showPaywall().then(async (result) => {
                                if (result) {
                                    await new Promise(r => setTimeout(r, 1000));
                                    await reloadUser();
                                }
                                else {
                                    Alert.alert("Failed to purchase!");
                                }
                            })
                        }
                    }]
                );
            }
        }
        checkLimit();
    }, [user, isPremium]);



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView keyboardShouldPersistTaps="handled">
                <ThemedView style={styles.container}>
                    <ImportNotice focused={focused} />
                    <ThemedText style={styles.title}>🍳 Import a Recipe</ThemedText>
                    {/* Image upload */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={pickImageAndUpload}
                        disabled={loading}>
                        <ThemedText style={styles.buttonText}>Upload Recipe Image</ThemedText>
                    </TouchableOpacity>

                    <ThemedText style={styles.or}>OR</ThemedText>

                    {/*  YouTube URL input */}
                    <TextInput
                        placeholder="Paste video URL here"
                        value={youtubeUrl}
                        onChangeText={setYouTubeUrl}
                        style={styles.input}
                        autoCapitalize='none'
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        readOnly={loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={submitVideoUrl}
                        disabled={loading}>
                        <ThemedText style={styles.buttonText}>Import from video URL</ThemedText>
                    </TouchableOpacity>

                    {loading && (
                        <ThemedView style={styles.loading}>
                            <ActivityIndicator size="large" />
                            <ThemedText>Importing recipe...</ThemedText>
                        </ThemedView>
                    )}
                </ThemedView>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    },
    title: {
        fontSize: 26,
        lineHeight: 32, // fontSize * 1.2
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center"
    },
    button: {
        backgroundColor: "#2E7D32",
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    or: {
        textAlign: "center",
        marginVertical: 16,
        color: "#666",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    secondaryButton: {
        backgroundColor: "#1565C0",
    },
    loading: {
        marginTop: 20,
        alignItems: "center",
    }
});