import * as React from "react";
import { Linking, StyleSheet, View, Image } from "react-native";
import { Card, Text, IconButton, Button } from "react-native-paper";

type BoothProps = {
  name: string;
  number: number;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  onDeletePress?: () => void;
  onEditPress?: () => void;
};

export default function CustomBoothCard({
  name,
  number,
  lat,
  lng,
  imageUrl,
  onEditPress,
  onDeletePress,
}: BoothProps) {
  const openGoogleMaps = () => {
    const geoUrl = name
      ? `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(name)})`
      : `geo:${lat},${lng}`;

    Linking.openURL(geoUrl).catch((err) => {
      console.error("Failed to open Google Maps", err);
    });
  };

  return (
    <Card style={styles.card} mode="elevated">
      <View style={styles.row}>
        {/* Left side — image or placeholder */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Text variant="bodyMedium" style={styles.placeholderText}>
               Add a Trinket!
              </Text>
            </View>
          )}
        </View>

        {/* Right side — content */}
        <View style={styles.contentContainer}>
          {/* Header row — title, booth ID, icons */}
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Text
                variant="titleMedium"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.title}
              >
                {name}
              </Text>
              <Text variant="bodySmall" style={styles.boothID}>
                Booth ID: {number}
              </Text>
            </View>

            <View style={styles.iconContainer}>
              <IconButton
                icon="pencil"
                size={20}
                onPress={onEditPress}
                style={styles.icon}
              />
              <IconButton
                icon="trash-can"
                size={20}
                onPress={onDeletePress}
                style={[styles.icon, styles.deleteIcon]}
              />
            </View>
          </View>

          {/* Button section with locked spacing */}
        <View style={styles.buttonContainer}>
  {/* Always on top */}
  <Button mode="outlined" style={styles.button}>
    View Booth Items
  </Button>

  {/* Always below, reserve space even if missing */}
  {lat && lng ? (
    <Button
      icon="map-marker"
      mode="outlined"
      style={styles.locationButton}
      onPress={openGoogleMaps}
    >
      Return to Booth
    </Button>
  ) : (
    // <View style={[styles.locationButton, styles.hiddenButton]} />
     <Button
      icon="map-marker"
      mode="outlined"
      style={[styles.locationButton, {opacity: 0.4}]}
      labelStyle={{color: "#c0c0c0", }}
    >
      Return to Booth
    </Button>
  )}
</View>

        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    height: 180, // consistent height
  },
  imageContainer: {
    flex: 0.4, // 40% width for image
    backgroundColor: "#f3f3f3",
  },
  image: {
    width: "100%",
    height: "100%", // full height of the card
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
  },
  placeholderText: {
    color: "#666",
  },
  contentContainer: {
    flex: 0.6,
    padding: 12,
    justifyContent: "space-between", // evenly distribute top/bottom
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  boothID: {
    color: "#6b6b6b",
    fontSize: 12,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  icon: {
    margin: 0,
  },
  deleteIcon: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    borderRadius: 50,
  },
buttonContainer: {
  marginTop: 10,
  justifyContent: "flex-start",
},
button: {
  marginTop: 4,
},
locationButton: {
  marginTop: 10,
},
hiddenButton: {
  opacity: 0, // invisible but keeps the space
  height: 40, // same height as the normal button
},
});
