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
import * as ImagePicker from "expo-image-picker";
import { Button, IconButton, TextInput, Text } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

type Props = NativeStackScreenProps<RootStackParamList, "EditMarketScreen">;

export default function EditMarketScreen({ route, navigation }: Props) {
  const { marketUUID, marketNameCurr, startDateCurr, endDateCurr, imgUriCurr } =
    route.params;
  const [marketName, setMarketName] = useState(marketNameCurr);
  const [startDate, setStartDate] = useState<Date | null>(startDateCurr);
  const [endDate, setEndDate] = useState<Date | null>(endDateCurr);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(imgUriCurr);
  const [imgData, setImageData] =
    useState<ImagePicker.ImagePickerResult | null>(null);

  const handleSubmit = async () => {
    if (!marketName.trim() || !startDate || !endDate) {
      Alert.alert("Error", "Please fill all fields and select dates");
      return;
    }

    console.log(
      "EditMarket submission: marketName: ",
      marketName,
      " startDate: ",
      startDate,
      " endDate: ",
      endDate,
      " img_url: ",
      imageUri
    );

    console.log(
      "EditMarket original values - marketNameCurr: ",
      marketNameCurr,
      " startDateCurr: ",
      startDateCurr,
      " endDateCurr: ",
      endDateCurr,
      " imgUriCurr: ",
      imgUriCurr
    );
    const formData = new FormData();

    if (imgData != null && imgData.assets != null) {
      console.log(
        "EditMarket: preparing to upload image with data: ",
        JSON.stringify(imgData)
      );
      const file = {
        uri: imgData.assets[0].uri,
        type: imgData.assets[0].mimeType,
        name: imgData.assets[0].fileName,
      };
      formData.append("image", file as any);
    }
    if (marketNameCurr !== marketName) {
      formData.append("name", marketName);
    }
    if (startDateCurr !== startDate) {
      formData.append("startdate", startDate.toISOString());
    }
    if (endDateCurr !== endDate) {
      formData.append("enddate", endDate.toISOString());
    }
    if (imgUriCurr !== imageUri) {
      formData.append("img_url", imageUri ? imageUri : "");
    }
    try {
      console.log(
        "EditMarket: formData to be sent: ",
        JSON.stringify(formData)
      );
      const response = await axios.patch(
        `http://192.168.2.173:3000/api/marketEvent/${marketUUID}/1`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("EditMarket submission response: ", JSON.stringify(response));
      setImageUri(response.data.downloadUrl);
    } catch (error) {
      console.log("EditMarket error from submission: ", error);
    }
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 1],
      quality: 1,
    });
    setImageData(result);
    console.log("EditMarket: result of img upload:", JSON.stringify(result));

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); // now imageUri points to the cropped image
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Back arrow fixed at top-left */}

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
            Edit Market
          </Text>

          <TextInput
            label="Market Name"
            value={marketName}
            onChangeText={setMarketName}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="outlined"
            onPress={() => setStartPickerVisible(true)}
            style={styles.input}
          >
            {startDate ? startDate.toDateString() : "Select Start Date"}
          </Button>
          <DateTimePickerModal
            isVisible={isStartPickerVisible}
            mode="date"
            minimumDate={new Date()}
            onConfirm={(date: Date) => {
              setStartDate(date);
              setStartPickerVisible(false);
            }}
            onCancel={() => setStartPickerVisible(false)}
          />

          <Button
            mode="outlined"
            onPress={() => setEndPickerVisible(true)}
            style={styles.input}
          >
            {endDate ? endDate.toDateString() : "Select End Date"}
          </Button>
          <DateTimePickerModal
            isVisible={isEndPickerVisible}
            mode="date"
            minimumDate={startDate ? startDate : new Date()}
            onConfirm={(date: Date) => {
              setEndDate(date);
              setEndPickerVisible(false);
            }}
            onCancel={() => setEndPickerVisible(false)}
          />

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <IconButton icon="camera-plus" size={40} />
            )}
          </TouchableOpacity>

          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Update
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  imagePicker: {
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 160,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
});
