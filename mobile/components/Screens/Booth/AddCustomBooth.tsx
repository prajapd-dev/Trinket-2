import React, { useContext, useState } from "react";
import { View, Alert, StyleSheet, Platform } from "react-native";
import { Button, IconButton, TextInput, Text } from "react-native-paper";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../type";
import { useMarket } from "../../Contexts/MarketContext";

export default function AddCustomBooth({ navigation }: { navigation: any }) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [boothNumber, setBoothNumber] = useState("");
  const [boothName, setBoothName] = useState("");

  // using the market context to get the selected market id
  const { selectedMarketId } = useMarket();
  const marketId = selectedMarketId;

  // okay so when i send this, we should have the market id ... from somewhere and then the
  // we also need to get the user id? from the session i guess
  // when we select a market that market ID should be stored in context or something so we can access it here
  // then we can send the booth creation request with that market ID and the user ID from session
  const addLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location access is required.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
  };

  const stripBoothNumber = (boothNum: string) => {
    // Remove all invalid characters (anything that's not a digit or dash)
    boothNum = boothNum.replace(/[^0-9-]/g, "");

    // If there’s more than one dash, remove extras
    const parts = boothNum.split("-");
    if (parts.length > 2) {
      // keep only the first dash
      boothNum = parts[0] + "-" + parts.slice(1).join("").replace(/-/g, "");
    }
    setBoothNumber(boothNum);
  };

  const handleSubmit = async () => {
    if (boothNumber.trim() === "") {
      Alert.alert("Validation Error", "Booth Number cannot be empty.");
      return;
    }
    // Further submission logic goes here
    const postData = {
      boothName,
      boothNumber,
      marketId,
      location,
    };
    console.log("Submitting booth data: ", postData);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/custom_booth/1`,
        postData
      );
      console.log(
        "AddCustomBooth submission response: ",
        JSON.stringify(response)
      );
    } catch (error) {
      console.log("AddCustomBooth error from submission: ", error);
    }
    // Alert.alert("Booth Saved", "Your booth has been saved successfully.");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.backButton}>
            <IconButton
              icon="arrow-left"
              size={28}
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
        <View style={styles.form}>
          <Text variant="headlineMedium" style={styles.title}>
            Add Booth
          </Text>

          <TextInput
            label="Booth Number"
            mode="outlined"
            style={styles.input}
            inputMode="numeric"
            onChangeText={stripBoothNumber}
            value={boothNumber}
          />
          <TextInput
            label="Booth Name"
            mode="outlined"
            style={styles.input}
            value={boothName}
            onChangeText={setBoothName}
          />

          <Button
            icon="map-marker"
            mode={location ? "contained-tonal" : "outlined"}
            onPress={addLocation}
            style={styles.button}
          >
            {location ? "Location Saved" : "Add Current Location"}
          </Button>

          <Button mode="contained" style={styles.submit} onPress={handleSubmit}>
            Save Booth
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, // ✅ makes sure it fills the screen
    backgroundColor: "#fff",
  },
  backButton: {
    width: 50, // bigger circle
    height: 50,
    borderRadius: 25, // perfect circle
    backgroundColor: "#d2ceceff", // grey background
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
  container: {
    flex: 1,
    justifyContent: "center", // ✅ vertical center
    alignItems: "center", // ✅ horizontal center
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 24, // top-left
    left: 24,
    zIndex: 1, // ensure it floats above form
  },
  form: {
    width: "100%",
    maxWidth: 400, // keeps it neat on tablets
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  submit: {
    marginTop: 8,
  },
});
