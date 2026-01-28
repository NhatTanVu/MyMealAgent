import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { api } from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { RelativePathString, useRouter } from 'expo-router';
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ImportRecipeScreen() {
    const [youtubeUrl, setYouTubeUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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
                    const res = await api.post("/recipes/import", formData);
                    const data = await res.data;

                    Alert.alert("Success", "Recipe imported from image!");
                    console.log(data);
                    router.push(`/recipe/${data.id}` as RelativePathString)
                }
                catch (err: any) {
                    Alert.alert("Error", err.message || "Failed to import image");
                }
                finally {
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Error picking or uploading image:", error);
        }
    };

    const submitYouTubeUrl = async () => {
        if (!youtubeUrl.trim()) {
            Alert.alert("Error", "Please enter a YouTube URL");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("source_url", youtubeUrl.trim());
            const res = await api.post("/recipes/import", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Alert.alert("Success", "Recipe imported from YouTube!");
            console.log(res.data);
            router.push(`/recipe/${res.data.id}` as RelativePathString)
        }
        catch (err: any) {
            Alert.alert("Error", err.message || "Failed to import from YouTube");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>🍳 Import a Recipe</ThemedText>
            {/* Image upload */}
            <TouchableOpacity style={styles.button} onPress={pickImageAndUpload}>
                <ThemedText style={styles.buttonText}>Upload Recipe Image</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.or}>OR</ThemedText>

            {/*  YouTube URL input */}
            <TextInput
                placeholder="Paste YouTube URL here"
                value={youtubeUrl}
                onChangeText={setYouTubeUrl}
                style={styles.input}
                autoCapitalize='none'
            />

            <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={submitYouTubeUrl}>
                <ThemedText style={styles.buttonText}>Import from YouTube</ThemedText>
            </TouchableOpacity>

            {loading && (
                <ThemedView style={styles.loading}>
                    <ActivityIndicator size="large" />
                    <ThemedText>Importing recipe...</ThemedText>
                </ThemedView>
            )}

        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: "center",
    },
    title: {
        fontSize: 26,
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