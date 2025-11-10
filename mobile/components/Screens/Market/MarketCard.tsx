import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";

type MarketCardProps = {
  name: string;
  image: any; // require("../assets/market.jpg") or { uri: "https://example.com/image.jpg" }
  startDate: Date;
  endDate: Date;
  onPress?: () => void; // callback when card is pressed
  onEditPress?: () => void;
};

export default function MarketCard({
  name,
  image,
  startDate,
  endDate,
  onPress,
  onEditPress,
}: MarketCardProps) {
  const imageSource =
    typeof image === "string"
      ? { uri: image }
      : require("../../../assets/market-stock.png"); // handle both cases

  const onDeletePress = () => {
    console.log("MarketCard: deleted");
  };

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      {/* Top image */}
      <Card.Cover source={imageSource} style={styles.image} />
      {/* Edit icon overlay */}
      <View style={styles.iconContainer}>
        <IconButton
          icon="pencil"
          size={22}
          style={styles.icon}
          onPress={onEditPress}
        />
        <IconButton
          icon="trash-can"
          size={20}
          onPress={onDeletePress}
          style={[styles.icon, styles.deleteIcon]}
        />
      </View>

      {/* Card content */}
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={styles.date}>
          {formatDateRange(startDate.toDateString(), endDate.toDateString())}
        </Text>
      </Card.Content>
    </Card>
  );
}

function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return `${startDate.toLocaleDateString(
    undefined,
    options
  )} - ${endDate.toLocaleDateString(undefined, options)}`;
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
  iconContainer: {
    position: "absolute",     // 👈 makes it overlay on top of the Card
    top: 8,
    right: 8,
    flexDirection: "row",
    zIndex: 1,                // ensure it sits above the image
  },
  icon: {
    margin: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // optional: slight background for contrast
  },
  deleteIcon: {
    backgroundColor: "rgba(220, 53, 69, 0.45)",
    borderRadius: 50,
    marginLeft: 4,
  },
  title: {
    marginTop: 8,
    fontWeight: "600",
  },
  date: {
    color: "#6b6b6b",
    marginTop: 4,
  },
});

