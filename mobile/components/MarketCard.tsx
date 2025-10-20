import * as React from "react";
import { StyleSheet } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";

type MarketCardProps = {
  name: string;
  image: any; // require("../assets/market.jpg") or { uri: "https://example.com/image.jpg" }
  startDate: Date;
  endDate: Date;
  onPress?: () => void; // callback when card is pressed
  onEditPress?: () => void; 
};

export default function MarketCard({ name, image, startDate, endDate, onPress, onEditPress }: MarketCardProps) {
     const imageSource =
    typeof image === "string" ? { uri: image } : image; // handle both cases
    
  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      {/* Top image */}
      <Card.Cover source={imageSource} style={styles.image} />
     {/* Edit icon overlay */}
        <IconButton
          icon="pencil"
          size={22}
          style={styles.editIcon}
          onPress={onEditPress}
        />
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

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${startDate.toLocaleDateString(undefined, options)} - ${endDate.toLocaleDateString(undefined, options)}`;
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
  title: {
    marginTop: 8,
    fontWeight: "600",
  },
  date: {
    color: "#6b6b6b",
    marginTop: 4,
  },
   editIcon: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
