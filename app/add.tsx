import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Add() {
  // form state
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("");
  const [distance, setDistance] = useState<string>("");

  // image state
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets?.length) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      // save base64 string if available
      if (asset.base64) {
        setImageBase64(asset.base64);
      } else {
        // fallback: read file manually
        try {
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            const b64 = reader.result?.toString().split(",")[1] || null;
            if (b64) setImageBase64(b64);
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          console.warn("Unable to convert image to base64", e);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.titleShow}> สถานที่วิ่ง </Text>
        <TextInput
          placeholder="เฃ่น สวนลุม"
          style={styles.inputvalue}
          value={location}
          onChangeText={setLocation}
        />
        <Text style={styles.titleShow}> ระยะทาง (กิโลเมตร) </Text>
        <TextInput
          placeholder="เช่น 5"
          style={styles.inputvalue}
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />
        <Text style={styles.titleShow}> ช่วงเวลา </Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={[
              styles.timeButton,
              selectedTime === "เช้า" && styles.timeButtonSelected,
            ]}
            onPress={() => setSelectedTime("เช้า")}
          >
            <Text
              style={
                selectedTime === "เช้า"
                  ? styles.timeTextSelected
                  : styles.timeText
              }
            >
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.timeButton,
              selectedTime === "เย็น" && styles.timeButtonSelected,
            ]}
            onPress={() => setSelectedTime("เย็น")}
          >
            <Text
              style={
                selectedTime === "เย็น"
                  ? styles.timeTextSelected
                  : styles.timeText
              }
            >
              เย็น
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.titleShow}> รูปภาพสถานที่ </Text>
        <TouchableOpacity style={styles.cameraPlaceholder} onPress={openCamera}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <Ionicons name="camera" size={32} color="#888" />
          )}
          <Text style={styles.cameraPlaceholderText}>กดเพื่อถ่ายรูป</Text>
        </TouchableOpacity>
        {/* save button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            /*TODO: save logic*/
          }}
        >
          <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  inputvalue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#1893da",
    borderRadius: 5,
    alignItems: "center",
  },
  timeButtonSelected: {
    backgroundColor: "#1893da",
  },
  timeText: {
    color: "#1893da",
    fontFamily: "Kanit_700Bold",
  },
  timeTextSelected: {
    color: "#fff",
    fontFamily: "Kanit_700Bold",
  },
  cameraPlaceholder: {
    height: 150,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#1893da",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
  },
  cameraPlaceholderText: {
    marginTop: 10,
    color: "#888",
    fontFamily: "Kanit_400Regular",
  },
});
