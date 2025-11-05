import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  TextInput,
  Text,
  IconButton,
  HelperText,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddItem({ navigation }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [boothNumber, setBoothNumber] = useState("");
  const [boothName, setBoothName] = useState("");
  const [price, setPrice] = useState("");

  const updatePriceText = (text: string) => {
    // Remove all non-digits except decimal point
    text = text.replace(/[^\d.]/g, "");

    // Only allow one decimal point
    const parts = text.split(".");
    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    console.log("Price parts: ", parts);
    if (parts.length > 2) {
      text = parts[0] + "." + parts[1]; // drop extra dots
      console.log("Corrected price text with single decimal: ", text);
    }

    // Limit to two decimal digits
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
    }

    console.log("Final price parts before rejoin: ", parts);
    // Rejoin and update
    text = parts.join(".");
    setPrice(text);
  };

  const checkEmptyInput = (text: string) => {
    if (text.trim() === "") {
      return false;
    }
    return true;
  };

  const removeLeadingSpaces = (text: string) => {
    return text.replace(/^\s+/, "");
  };

  const checkPriceInput = (text: string) => {
    // Allow only numbers and a single decimal point
    console.log("Checking price input: ", text);
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    if (regex.test(text)) {
      setPrice(text);
      return true;
    } else {
      console.log("Invalid price input: ", text);
      return false;
    }
  };

  const pickImage = async () => {
    if (images.length >= 3) {
      Alert.alert("Limit Reached", "You can only add up to 3 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 3) {
      Alert.alert("Limit Reached", "You can only add up to 3 images.");
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission denied",
        "Camera access is required to take photos."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };
  const handleSubmit = () => {
    if (!itemName.trim()) {
      Alert.alert("Error", "Please enter an item name.");
      return;
    } else if (checkPriceInput(price) === false) {
      Alert.alert("Error", "Please enter a valid price.");
      return;
    }

    console.log({
      itemName,
      description,
      boothNumber,
      boothName,
      price,
      images,
      location,
    });

    Alert.alert("Success", "Item added successfully!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20} // adds extra spacing above keyboard
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text variant="headlineMedium" style={styles.title}>
            Add Item
          </Text>

          {/* Image Grid */}
          <View style={styles.imageGrid}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.imageCell} />
            ))}
            {images.length < 9 && (
              <TouchableOpacity style={styles.imageCell} onPress={pickImage}>
                <IconButton icon="plus" size={40} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.buttonRow}>
            <Button icon="camera" mode="outlined" onPress={takePhoto}>
              Take Photo
            </Button>
            <Button icon="image" mode="outlined" onPress={pickImage}>
              Choose from Library
            </Button>
          </View>

          <TextInput
            label="Item Name"
            value={itemName}
            onChangeText={setItemName}
            onBlur={() => setItemName(removeLeadingSpaces(itemName))}
            mode="outlined"
            error={!checkEmptyInput(itemName) && itemName !== ""}
          />
          <HelperText
            style={styles.HelperText}
            type="error"
            visible={!checkEmptyInput(itemName) && itemName !== ""}
          >
            Please remove leading spaces and enter a valid item name.
          </HelperText>

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            maxLength={300}
            textAlignVertical="top"
            style={styles.input}
            onBlur={() => setDescription(removeLeadingSpaces(description))}
          />
          <HelperText style={styles.HelperText} type="info" visible={true}>
            {description.length}/300
          </HelperText>

          <TextInput
            label="Booth Number"
            value={boothNumber}
            onChangeText={setBoothNumber}
            mode="outlined"
            inputMode="numeric"
          />
          <HelperText
            style={styles.HelperText}
            type="error"
            visible={!checkEmptyInput(itemName) && itemName !== ""}
          >
            Please remove leading spaces and enter a valid item name.
          </HelperText>
          <TextInput
            label="Booth Name"
            value={boothName}
            onChangeText={setBoothName}
            mode="outlined"
          />
          <HelperText
            style={styles.HelperText}
            type="error"
            visible={!checkEmptyInput(itemName) && itemName !== ""}
          >
            Please remove leading spaces and enter a valid item name.
          </HelperText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <TextInput
              label="Price"
              value={price}
              onChangeText={updatePriceText}
              keyboardType="numeric"
              mode="outlined"
              style={{ width: 130 }}
              left={<TextInput.Affix text="$" />}
            />
          </View>

          <Button mode="contained" onPress={handleSubmit} style={styles.submit}>
            Save Item
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  imageCell: {
    width: 100,
    height: 100,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  HelperText: {
    marginBottom: 6,
  },
  input: {
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    textAlignVertical: "top", // important: text starts at top
    minHeight: 90, // ensures it looks multiline even if numberOfLines ignored
  },
  submit: {
    marginTop: 8,
  },
  decimal: {
    fontSize: 28,
    marginHorizontal: 2,
  },
});
