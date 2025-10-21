import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, IconButton, TextInput, Text } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';

export default function AddMarketScreen({navigation}: any) {
     const [marketName, setMarketName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imgData, setImageData] = useState<ImagePicker.ImagePickerResult | null>(null)

  const handleSubmit = async () => {
    if (!marketName.trim() || !startDate || !endDate) {
      Alert.alert("Error", "Please fill all fields and select dates");
      return;
    }

    // Example submission
    console.log("example submission: ", {
      marketName,
      startDate,
      endDate,
      imageUri,
    });

    if (imgData != null && imgData.assets != null) {
    const formData = new FormData(); 
    const file = {
      uri: imgData.assets[0].uri,
      type: imgData.assets[0].mimeType, 
      name: imgData.assets[0].fileName
    }
    formData.append('image', file as any) 

    formData.append('marketName', marketName)
    formData.append('startDate', startDate.toISOString())
    formData.append('endDate', endDate.toISOString())
    formData.append('img_uri', imageUri? imageUri : "")
    try {
      const response = await axios.post(
        'http://192.168.2.173:3000/api/marketEvent/1', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log("response:", response)
    } catch (error) {
      console.log("error from submission: ", error)
    }
  }
    navigation.goBack({ state: { reload: true } });
  };

    const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], 
        allowsEditing: true, 
        aspect: [4, 3],
        quality: 1
    })
     setImageData(result)
     console.log("result of img upload:", result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>Add Market</Text>

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
          minimumDate={startDate? startDate : new Date()}
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
          Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff",
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
    height: 150,
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
