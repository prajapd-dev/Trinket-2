import { View } from "react-native";
import { Text } from "react-native-paper";

export default function SplashScreen({setLoading}:any) {
  setLoading(false)
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Trinket ✨</Text>
    </View>
  );
}
