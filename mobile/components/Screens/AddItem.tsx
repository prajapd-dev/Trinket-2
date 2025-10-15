import { StyleSheet, View, Text } from "react-native";


export default function AddItem({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <Text> Add Item Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  }
});
