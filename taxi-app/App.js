import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { AuthProvider } from "./contexts/AuthContext";
import AppNavigator from "./routes";

export default function App() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // behavior tùy thuộc vào hệ điều hành
    >
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Đảm bảo toàn bộ màn hình có thể sử dụng
  },
});
