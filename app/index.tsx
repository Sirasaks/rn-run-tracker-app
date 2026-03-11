import { supabase } from "@/service/supabase";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

// use a relative path for the image require
const runing = require("../assets/images/runing.png");
export default function Index() {
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // Wait for 2 seconds to show splash
      setTimeout(() => {
        if (session) {
          router.replace("/run");
        } else {
          router.replace("/login");
        }
      }, 2000);
    };

    checkSession();
  }, []);
  return (
    <View style={styles.container}>
      <Image source={runing} style={styles.imglogo} />
      <Text style={styles.appname}>Run Tracker</Text>
      <Text style={styles.appthainame}>วิ่งเพื่อสุขภาพที่ดีขึ้น </Text>
      <ActivityIndicator size="large" color="#1893da" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  imglogo: { width: 200, height: 200 },
  appname: { fontFamily: "Kanit_700Bold", fontSize: 24, marginTop: 20 },
  appthainame: {
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
});
