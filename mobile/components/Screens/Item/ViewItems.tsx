import { FlatList, StyleSheet, View } from "react-native";
import { Card, Text, IconButton, Chip } from "react-native-paper";
import ItemCard from "./ItemCard";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AddItem from "../../Buttons/AddItem";

const products = [
  {
    id: "1",
    name: "Mew",
    price: "$433",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#4F7EFF",
  },
  {
    id: "2",
    name: "Mewtwo",
    price: "$179",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#F85B6A",
  },
  {
    id: "3",
    name: "Mew3",
    price: "$19",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#FFA726",
  },
  {
    id: "4",
    name: "Mew4",
    price: "$1299",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#8E7CFF",
  },
    {
    id: "5",
    name: "Mew4",
    price: "$1299",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#8E7CFF",
  },
    {
    id: "6",
    name: "Mew4",
    price: "$1299",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#8E7CFF",
  },
    {
    id: "7",
    name: "Mew7",
    price: "$1299",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#8E7CFF",
  },
      {
    id: "8",
    name: "Mew8",
    price: "$1299",
    image:
      "https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1756",
    bg: "#8E7CFF",
  },
];

export default function ViewItems({navigation}: any) {
  const renderItem = ({ item }: any) => {
    return <ItemCard item={item} />;
  };

  const onPressAddItem = () => {
    console.log("button pressed")
    navigation.navigate("AddItem", navigation);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AddItem onPressAddItem={onPressAddItem}/>
        <Text style={styles.boothName}> Item Name </Text>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
      boothName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#4B0082",
    margin: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
