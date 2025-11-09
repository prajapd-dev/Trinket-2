import * as React from 'react';
import { View, FlatList, ImageBackground, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Chip } from 'react-native-paper';


export default function ItemCard({item}: any) {
  

  return (
    <Card style={styles.card} mode="elevated">
      <ImageBackground
        source={{ uri: item.image }}
        imageStyle={styles.imageBackground}
        style={styles.imageContainer}
      >
        <IconButton
          icon="pencil"
          size={22}
          style={styles.heart}
          iconColor="#fff"
          onPress={() => {}}
        />
      </ImageBackground>

      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={styles.name}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={styles.price}>
          {item.price}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  imageContainer: {
    height: 180,
    justifyContent: 'flex-start',
  },
  imageBackground: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  heart: {
    alignSelf: 'flex-end',
    margin: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  textContainer: {
    padding: 12,
  },
  name: {
    color: '#000',
    fontWeight: '600',
  },
  price: {
    color: '#555',
  },
});