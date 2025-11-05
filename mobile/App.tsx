import { AppState, AppStateStatus, StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { RootNavigator } from "./components/Navigation/RootNavigator";
import SplashScreen from "./components/Screens/Entry/SplashScreen";
import { MarketProvider } from "./components/Contexts/MarketContext";

export default function App() {
  const [session, setSession] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true); // only show once

  // if (loading) {
  //   return <SplashScreen setLoading={setLoading} />; // some simple loading view
  // }

  return (
    <PaperProvider>
      <View style={styles.container}>
        <MarketProvider>
          <NavigationContainer>
            <RootNavigator
              session={session}
              showOnboarding={showOnboarding}
              setShowOnboarding={setShowOnboarding}
            />
          </NavigationContainer>
        </MarketProvider>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
