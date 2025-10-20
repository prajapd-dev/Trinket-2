import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import LavenderBackground from "../LavenderBackground"; // your animated background

export default function Auth() {
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* Animated background */}
      <LavenderBackground />

      {/* Input field */}
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Title */}
        <Text style={styles.title}>Sign In To Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        {/* Remember me */}
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <View
            style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
          />
          <Text style={styles.rememberText}>Remember me for 30 days</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    position: "absolute",
    top: "40%",
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#444343ff",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15, // add spacing from the input
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFF",
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: "#FFF",
  },
  rememberText: {
    color: "#5f5e5eff",
    fontSize: 14,
  },
});
