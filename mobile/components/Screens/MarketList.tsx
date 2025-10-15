import { StyleSheet, View, Text } from "react-native";
import MarketCard from "../MarketCard";


export default function MarketList({navigation}: {navigation: any}) {
  return (
    <View style={styles.container}>
      <MarketCard
  name="Downtown Farmers Market"
  image={require("../../assets/FanExpoCanada.png")}
  startDate="2025-05-01"
  endDate="2025-10-15"
  // onPress={() => navigation.navigate("MarketDetails", { marketId: 123 })}
    onPress={() => navigation.navigate("MainTabs", {screen:"Account"})}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
