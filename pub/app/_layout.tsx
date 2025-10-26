import { Slot } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function RootLayout() {
    return (
        <View style={styles.container}>
            {/* Header only */}
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Mobile Bridge</Text>
            </View>

            {/* Slot renders child screens */}
            <View style={styles.slotContainer}>
                <Slot />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: {
        marginTop: 50,
        alignItems: "center",
    },
    header: { fontSize: 24, fontWeight: "bold" },
    slotContainer: { flex: 1 },
});
