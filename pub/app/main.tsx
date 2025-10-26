import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Switch, Text, View } from "react-native";
// @ts-ignore
import Slider from "@react-native-community/slider";
import mqtt from "mqtt";

export default function MainScreen() {
    const router = useRouter();
    const { ip } = useLocalSearchParams(); // IP query param
    const [client, setClient] = useState<mqtt.MqttClient | null>(null);
    const [vibrateDuration, setVibrateDuration] = useState<number>(500);
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
        if (!client) {
            Alert.alert("Error", "MQTT client not connected");
            return;
        }
        const message = JSON.stringify({ command: "vibrate", ms: vibrateDuration });
        client.publish(topic, message, (err) => {
            if (err) Alert.alert("Error", "Failed to send MQTT message");
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hardware controller</Text>
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

            {/* Vibrate section with Slider */}
            <View style={styles.section}>
                <Text style={styles.label}>
                    Vibrate Duration: {vibrateDuration} ms
                </Text>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={0}
                    maximumValue={2000}
                    step={50}
                    minimumTrackTintColor="#007AFF"
                    maximumTrackTintColor="#ccc"
                    thumbTintColor="#007AFF"
                    value={vibrateDuration}
                    onValueChange={setVibrateDuration}
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
});
