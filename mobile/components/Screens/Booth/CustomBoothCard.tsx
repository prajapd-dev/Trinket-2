import * as React from "react";
import { Linking, StyleSheet } from "react-native";
import { Card, Text, IconButton, Button } from "react-native-paper";

type BoothProps = {
  name: string;
  number: number;
  lat: number;
  lng: number;
  onDeletePress?: () => void;
  onEditPress?: () => void;
};

export default function CustomBoothCard({
  name,
  number,
  lat,
  lng,
  onEditPress,
  onDeletePress,
}: BoothProps) {
  const openGoogleMaps = () => {
    console.log("Opening Google Maps for coordinates: ", lat, lng);
    // Build the geo URL
    const geoUrl = name
      ? `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`
      : `geo:${lat},${lng}`;

    // Open the Maps app
    Linking.openURL(geoUrl).catch((err) => {
      console.error("Failed to open Google Maps", err);
    });
  };

  return (
    <Card style={styles.card} mode="elevated">
      {/* Edit icon overlay */}
      <IconButton
        icon="pencil"
        size={25}
        style={styles.editIcon}
        onPress={onEditPress}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      />
      {/* delete icon overlay */}
      <IconButton
        icon="trash-can"
        size={25}
        style={styles.deleteIcon}
        onPress={onDeletePress}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      />
      {/* Card content */}
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {name}
        </Text>
        <Button mode="outlined" style={styles.button}>
          View Booth Items
        </Button>
        {lat && lng && (
          <Button
            icon="map-marker"
            mode="outlined"
            style={styles.Locationbutton}
            onPress={openGoogleMaps}
          >
           Return to Booth
          </Button>
        )}
        <Text variant="bodySmall" style={styles.boothID}>
          Booth ID: {number}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    height: 160,
  },
  button: {
    marginTop: 30,
  },
  title: {
    marginTop: 14,
    fontWeight: "600",
  },
  date: {
    color: "#6b6b6b",
    marginTop: 4,
  },
  boothID: {
    marginTop: 14,
    textAlign: "left",
  },
  editIcon: {
    position: "absolute",
    top: 4,
    right: 60,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  deleteIcon: {
    position: "absolute",
    top: 4,
    right: 6,
    backgroundColor: "rgba(220, 53, 69, 0.8)",
  },
  Locationbutton: {
    marginTop: 20,
  },
});
