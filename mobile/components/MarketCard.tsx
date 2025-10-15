import * as React from "react";
import { StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";

type MarketCardProps = {
  name: string;
  image: any; // require("../assets/market.jpg") or { uri: "https://example.com/image.jpg" }
  startDate: string;
  endDate: string;
  onPress?: () => void; // callback when card is pressed
};

export default function MarketCard({ name, image, startDate, endDate, onPress }: MarketCardProps) {
     const imageSource =
    typeof image === "string" ? { uri: image } : image; // handle both cases

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      {/* Top image */}
      <Card.Cover source={imageSource} style={styles.image} />

      {/* Card content */}
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={styles.date}>
          {formatDateRange(startDate, endDate)}
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
});
