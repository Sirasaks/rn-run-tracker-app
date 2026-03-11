import { supabase } from "@/service/supabase";
import { Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const [saving, setSaving] = useState(false);

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


  const handleSaveToSupabase = async () => {
    if (!location || !distance || !selectedTime || !imageUri || !imageBase64) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setSaving(true);
    try {
      // 1. อัพโหลดรูปภาพไปยัง Supabase Storage
      const fileName = `img_${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("run_bk")
        .upload(fileName, decode(imageBase64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      // 2. ดึง Public URL ของรูปภาพ
      const { data: urlData } = supabase.storage
        .from("run_bk")
        .getPublicUrl(fileName);
      const image_url = urlData.publicUrl;

      // 3. บันทึกข้อมูลลงใน Supabase Database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");

      const { error: insertError } = await supabase.from("runs").insert({
        location,
        distance: parseFloat(distance),
        time_of_day: selectedTime,
        image_url,
        run_date: new Date().toISOString(),
        user_id: user.id,
      });

      if (insertError) throw insertError;

      Alert.alert("สำเร็จ", "บันทึกข้อมูลเรียบร้อยแล้ว");
      router.back();
    } catch (error: any) {
      Alert.alert("เกิดข้อผิดพลาด", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.label}>สถานที่วิ่ง</Text>
        <TextInput
          placeholder="เช่น สวนลุม"
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          placeholder="เช่น 5"
          style={styles.input}
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />

        <Text style={styles.label}>ช่วงเวลา</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.chip, selectedTime === "เช้า" && styles.chipActive]}
            onPress={() => setSelectedTime("เช้า")}
          >
            <Text
              style={[
                styles.chipText,
                selectedTime === "เช้า" && styles.chipTextActive,
              ]}
            >
              เช้า
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, selectedTime === "เย็น" && styles.chipActive]}
            onPress={() => setSelectedTime("เย็น")}
          >
            <Text
              style={[
                styles.chipText,
                selectedTime === "เย็น" && styles.chipTextActive,
              ]}
            >
              เย็น
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.label}> รูปภาพสถานที่ </Text>
        <TouchableOpacity style={styles.cameraPlaceholder} onPress={openCamera}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="camera" size={40} color="#DDD" />
              <Text style={styles.cameraPlaceholderText}>กดเพื่อถ่ายรูป</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* save button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSaveToSupabase}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>บันทึกข้อมูล</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingVertical: 10,
    fontFamily: "Kanit_400Regular",
    fontSize: 18,
    color: "#1893da",
    marginBottom: 20,
  },
  label: {
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#F0F0F0",
    minWidth: 80,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#1893da",
  },
  chipText: {
    fontFamily: "Kanit_400Regular",
    color: "#666",
    fontSize: 16,
  },
  chipTextActive: {
    color: "#FFF",
    fontFamily: "Kanit_700Bold",
  },
  cameraPlaceholder: {
    height: 200,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    marginBottom: 10,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#EEE",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  saveButton: {
    backgroundColor: "#1893da",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    shadowColor: "#1893da",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
  },
  cameraPlaceholderText: {
    marginTop: 10,
    color: "#AAA",
    fontFamily: "Kanit_400Regular",
    fontSize: 14,
  },
});
