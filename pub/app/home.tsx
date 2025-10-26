import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function HomeScreen() {
    const [ip, setIp] = useState("");
    const router = useRouter();

    const handlePress = () => {
        if (!ip.trim()) {
            Alert.alert("Error", "Please enter a Wi-Fi IP address");
            return;
        }
        router.push(`/main?ip=${ip}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Wi-Fi IP address (e.g., 192.168.1.5):</Text>
            <TextInput
                style={styles.input}
                placeholder="Type here..."
                value={ip}
                onChangeText={setIp}
            />
            <Button title="Enter" onPress={handlePress} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 16 },
    label: { fontSize: 18, marginBottom: 8 },
    input: {
        width: "80%",
        padding: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginBottom: 16,
    },
});
