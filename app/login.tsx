import { supabase } from "@/service/supabase";
import { Ionicons } from "@expo/vector-icons";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [loading, setLoading] = useState(false);

    const performGoogleSignIn = async () => {
        setLoading(true);
        try {
            // สร้าง Redirect URI ที่ยืดหยุ่นสำหรับทั้ง Expo Go และตอนเป็น App จริง
            const redirectUri = makeRedirectUri({
                preferLocalhost: true
            });
            console.log("Redirecting to Supabase with URI:", redirectUri);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: redirectUri,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

                if (result.type === 'success' && result.url) {
                    // Supabase returns tokens in the hash fragment (#) or search params (?)
                    const url = result.url.replace('#', '?');
                    const params = new URL(url).searchParams;
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });
                        if (sessionError) throw sessionError;
                        router.replace("/run");
                    }
                }
            }
        } catch (error: any) {
            console.error("Login error:", error);
            Alert.alert("เข้าสู่ระบบไม่สำเร็จ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../assets/images/runing.png")}
                    style={styles.logo}
                />
                <Text style={styles.title}>Run Tracker</Text>
                <Text style={styles.subtitle}>ยินดีต้อนรับสู่สังคมของนักวิ่ง</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.loginTitle}>เข้าสู่ระบบ</Text>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={performGoogleSignIn}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                            <Text style={styles.googleButtonText}>เข้าสู่ระบบด้วย Google</Text>
                        </>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    การเข้าสู่ระบบแสดงว่าคุณยอมรับข้อตกลงและเงื่อนไขของเรา
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1893da",
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    logo: {
        width: 120,
        height: 120,
        tintColor: "#fff",
    },
    title: {
        fontFamily: "Kanit_700Bold",
        fontSize: 28,
        color: "#fff",
        marginTop: 10,
    },
    subtitle: {
        fontFamily: "Kanit_400Regular",
        fontSize: 16,
        color: "#e1f5fe",
        marginTop: 5,
    },
    content: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    loginTitle: {
        fontFamily: "Kanit_700Bold",
        fontSize: 22,
        color: "#333",
        marginBottom: 30,
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: "100%",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleButtonText: {
        fontFamily: "Kanit_700Bold",
        fontSize: 16,
        color: "#333",
        marginLeft: 10,
    },
    footerText: {
        fontFamily: "Kanit_400Regular",
        fontSize: 12,
        color: "#999",
        textAlign: "center",
        marginTop: 30,
    },
});
