import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export default function Run() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>run</Text>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={24} color="rgb(255, 255, 255)" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    padding: 10,
    position: "absolute",
    bottom: 60,
    right: 40,
    backgroundColor: "#1893da",
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontFamily: "Kanit_700Bold",
  },
});
