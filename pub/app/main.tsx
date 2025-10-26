import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";
// @ts-ignore
import mqtt from "mqtt";

export default function MainScreen() {
    const router = useRouter();
    const { ip } = useLocalSearchParams(); // IP query param
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [vibrateDuration, setVibrateDuration] = useState("500");
    const [torchOn, setTorchOn] = useState(false);
    const topic = "phone/control";

    // Connect to MQTT broker
    useEffect(() => {
        if (!ip) return;

        const mqttClient = mqtt.connect(`ws://${ip}:9001`);
        setClient(mqttClient);

        mqttClient.on("connect", () => console.log("Connected to MQTT broker"));
        mqttClient.on("error", (err) => {
            console.log("MQTT error:", err);
            mqttClient.end();
        });

        return () => {
            mqttClient.end(); // disconnect when component unmounts
        };
    }, [ip]);

    const sendTorchCommand = (status: "on" | "off") => {
        if (!client) {
            Alert.alert("Error", "MQTT client not connected");
            return;
        }
        const message = JSON.stringify({ command: "torch", status });
        client.publish(topic, message, (err) => {
            if (err) Alert.alert("Error", "Failed to send MQTT message");
        });
    };

    const handleVibrate = () => {
        const ms = parseInt(vibrateDuration);
        if (!client) {
            Alert.alert("Error", "MQTT client not connected");
            return;
        }
        if (isNaN(ms) || ms <= 0) {
            Alert.alert("Error", "Please enter a valid positive number");
            return;
        }
        const message = JSON.stringify({ command: "vibrate", ms });
        client.publish(topic, message, (err) => {
            if (err) Alert.alert("Error", "Failed to send MQTT message");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Main Screen</Text>
            <Text style={styles.subtitle}>Wi-Fi IP: {ip}</Text>

            {/* Light switch */}
            <View style={styles.section}>
                <Text style={styles.label}>Light</Text>
                <Switch
                    value={torchOn}
                    onValueChange={(value) => {
                        setTorchOn(value);
                        sendTorchCommand(value ? "on" : "off");
                    }}
                />
            </View>

            {/* Vibrate section */}
            <View style={styles.section}>
                <Text style={styles.label}>Vibrate</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={vibrateDuration}
                    onChangeText={setVibrateDuration}
                    placeholder="Duration in ms"
                />
                <Button title="Activate" onPress={handleVibrate} />
            </View>

            <Button title="Change IP" onPress={() => router.push("/home")} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 16, marginBottom: 30 },
    section: { marginBottom: 30, alignItems: "center", width: "80%" },
    label: { fontSize: 18, marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        width: "100%",
        marginBottom: 10,
    },
});
