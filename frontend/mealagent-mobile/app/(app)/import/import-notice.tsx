import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from 'react-native';

type Props = {
    focused: boolean;
}

export default function ImportNotice({ focused }: Props) {
    return (
        <>
            <ThemedText style={styles.container}>
                ⚠️ <ThemedText style={styles.bold_text}>TikTok & Dailymotion</ThemedText> URLs are supported. <ThemedText style={styles.bold_text}>YouTube and Instagram</ThemedText> URLs are not supported due to platform restrictions.
            </ThemedText>
            {/* {focused ? (
                <ThemedText style={styles.container}>
                    ⚠️ TikTok & Dailymotion supported. Upload files for YouTube/Instagram.
                </ThemedText>
            ) : (
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title}>
                        ⚠️ Supported sources
                    </ThemedText>
                    <ThemedText style={styles.text}>
                        TikTok, Dailymotion, and uploaded video files are supported.
                    </ThemedText>
                    <ThemedText style={styles.warning}>
                        YouTube and Instagram links are not supported due to
                        platform restrictions. Please upload the video file instead.
                    </ThemedText>
                </ThemedView>
            )} */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: "#FFF4E5",
        marginBottom: 8,
        fontSize: 12,
        color: "#B45309"
    },
    bold_text: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#B45309"
    },
    title: {
        fontWeight: "bold",
        marginBottom: 6
    },
    text: {
        marginBottom: 6
    },
    warning: {
        color: "#B45309",
    }
});