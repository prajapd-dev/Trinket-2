import React, { useState } from "react";
import { View, Alert, StyleSheet, Platform, Linking } from "react-native";
import { Button, IconButton, TextInput, Text } from "react-native-paper";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "../../../type/type";
import Animated, { FadeIn } from "react-native-reanimated";
import { useMarket } from "../../Contexts/MarketContext";

export default function EditCustomBooth({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const {
    booth_uuid,
    boothNameCurr,
    boothNumberCurr,
    boothLatCurr,
    boothLngCurr,
  } = route.params;
  console.log("EditCustomBooth req.params: ", route.params);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    boothLatCurr && boothLngCurr
      ? { lat: boothLatCurr, lng: boothLngCurr }
      : null
  );

  const [boothNumber, setBoothNumber] = useState(boothNumberCurr || "");
  const [boothName, setBoothName] = useState(boothNameCurr || "");
  const [loading, setLoading] = useState(false);
  // using the market context to get the selected market id
  const { selectedMarketUuid: selectedMarketId } = useMarket();
  const marketId = selectedMarketId;

  // okay so when i send this, we should have the market id ... from somewhere and then the
  // we also need to get the user id? from the session i guess
  // when we select a market that market ID should be stored in context or something so we can access it here
  // then we can send the booth creation request with that market ID and the user ID from session
  const addLocation = async () => {
    setLoading(true);
    try {
      console.log("EditCustomBooth: Requesting location permission...");
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("Location permission status: ", status);
      if (status !== "granted") {
        console.log("EditCustomBooth: Location permission denied.");
        Alert.alert("EditCustomBooth: Permission denied", "Location access is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    } catch (error) {
      console.error("Error getting location: ", error);
    } finally {
      setLoading(false);
    }
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

  const openGoogleMaps = () => {
    console.log(
      "Opening Google Maps for coordinates: ",
      location?.lat,
      location?.lng
    );
    // Build the geo URL
    const geoUrl = boothName
      ? `geo:${location?.lat},${location?.lng}?q=${location?.lat},${
          location?.lng
        }(${encodeURIComponent(boothName)})`
      : `geo:${location?.lat},${location?.lng}`;

    // Open the Maps app
    Linking.openURL(geoUrl).catch((err) => {
      console.error("Failed to open Google Maps", err);
    });
  };

  const handleSubmit = async () => {
    console.log("EditCustomBooth - handleSubmit clicked");
    if (String(boothNumber).trim() === "") {
      Alert.alert("Validation Error", "Booth Number cannot be empty.");
      return;
    } else if (boothName.trim() == "") {
      Alert.alert("Validation error", "Booth Name cannot be empty.");
      return;
    }
    const updates: Partial<{
      name: string;
      number: number;
      latitude: number;
      longitude: number;
    }> = {};

    if (boothName != boothNameCurr) updates.name = boothName;
    if (boothNumber != boothNumberCurr) updates.number = boothNumber;
    if (location?.lat != boothLatCurr || location?.lng != boothLngCurr) {
      updates.latitude = location?.lat ? location.lat : 0;
      updates.longitude = location?.lng ? location.lng : 0;
    }

    console.log("EditCustomBooth: Submitting updates: ", updates);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/custom_booth/${booth_uuid}`,
        updates,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("EditCustomBooth response: ", response.data);
      Alert.alert("Booth Saved", "Your booth has been saved successfully.");
    } catch (error: any) {
      console.error(
        "EditCustomBooth submission error: ",
        error.response?.data || error.message
      );
      Alert.alert("Error", "Failed to update booth.");
    }
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
            Edit Booth
          </Text>

          <TextInput
            label="Booth Number"
            mode="outlined"
            style={styles.input}
            inputMode="numeric"
            onChangeText={stripBoothNumber}
            value={String(boothNumber)}
          />
          <TextInput
            label="Booth Name"
            mode="outlined"
            style={styles.input}
            value={boothName}
            onChangeText={setBoothName}
          />
          {location && location.lat && location.lng ? (
            <>
              <Animated.View entering={FadeIn} style={{ marginBottom: 10 }}>
                <Button
                  icon="map-marker"
                  mode={location ? "contained-tonal" : "outlined"}
                  style={styles.button}
                  onPress={openGoogleMaps}
                >
                  View Current Location
                </Button>
                <Button
                  icon="map-marker"
                  mode={location ? "contained-tonal" : "outlined"}
                  onPress={addLocation}
                  style={styles.button}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Grabbing Location..." : "Update Location"}
                </Button>
              </Animated.View>
            </>
          ) : (
            <Button
              icon="map-marker"
              mode={location ? "contained-tonal" : "outlined"}
              onPress={addLocation}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Grabbing Location..." : "Add Current Location"}
            </Button>
          )}

          <Button
            mode="contained"
            style={styles.submit}
            onPress={handleSubmit}
            disabled={loading}
          >
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
