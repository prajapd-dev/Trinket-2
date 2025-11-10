import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  Button,
  IconButton,
  TextInput,
  Text,
  HelperText,
} from "react-native-paper";
import LavenderBackground from "../../LavenderBackground";

export default function AddItem({ navigation }: any) {
  const [itemDescription, setitemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("0.00");
  const [itemName, setItemName] = useState("");
  const [imgData, setImageData] =
    useState<ImagePicker.ImagePickerResult | null>(null);
  const [imageUri, setImageUri] = useState("");

  const handleSubmit = () => {
    if (!itemName.trim()) {
      Alert.alert("Error", "Please enter an item name.");
      return;
    } else if (checkPriceInput(itemPrice) === false) {
      Alert.alert("Error", "Please enter a valid price.");
      return;
    }

    Alert.alert("Success", "Item added successfully!");
    navigation.goBack();
  };

  const checkPriceInput = (text: string) => {
    // Allow only numbers and a single decimal point
    console.log("Checking price input: ", text);
    const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
    if (regex.test(text)) {
      setItemPrice(text);
      return true;
    } else {
      console.log("Invalid price input: ", text);
      return false;
    }
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

    text = parts.join(".");
    setItemPrice(text);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setImageData(result);
    console.log("AddItem: result of img upload:", JSON.stringify(result));

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
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

    setImageData(result);
    console.log("AddItem: result of img taken:", JSON.stringify(result));
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <LavenderBackground />
      <KeyboardAvoidingView
         style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={20} // adds extra spacing above keyboard
      >
        {/* Back arrow fixed at top-left */}
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
            Add Item
          </Text>

          <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <IconButton icon="camera-plus" size={40} />
              )}
            </TouchableOpacity>
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
            mode="outlined"
          />
          <HelperText
            style={styles.HelperText}
            type="error"
            visible={!checkEmptyInput(itemName) && itemName !== ""}
          >
            Please remove leading spaces and enter a valid item name.
          </HelperText>

          <TextInput
            label="Item Description"
            value={itemDescription}
            onChangeText={setitemDescription}
            mode="outlined"
            multiline
            numberOfLines={3}
            maxLength={200}
            textAlignVertical="top"
            style={{height: 80}}
            onBlur={() =>
              setitemDescription(removeLeadingSpaces(itemDescription))
            }
          />

          <HelperText style={styles.HelperText} type="info" visible={true}>
            {itemDescription.length}/200
          </HelperText>

          <TextInput
            label="Price"
            value={itemPrice}
            onChangeText={updatePriceText}
            keyboardType="numeric"
            mode="outlined"
            style={{ width: 130 }}
            left={<TextInput.Affix text="$" />}
          />

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
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
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 24, // top-left
    left: 24,
    zIndex: 1, // ensure it floats above form
  },
  form: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  imagePicker: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
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

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  HelperText: {
    marginBottom: 6,
  },
});
