// src/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import Auth from "../Auth/Auth";
import MarketList from "../Screens/MarketList";
import TabsNavigator from "./TabNavigator";
import OnboardingScreen from "../Screens/Onboarding";
import EmailVerification from "../Auth/EmailVerification";
import AddMarketScreen from "../Screens/AddMarket";
import EditMarketScreen from "../Screens/EditMarket";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator({
  session,
  showOnboarding,
  setShowOnboarding,
}: any) {
  console.log(showOnboarding)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {showOnboarding && (
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              {...props}
              session={session}
              OnFinish={() => setShowOnboarding(false)}
            />
          )}
        </Stack.Screen>
      )}
      {/* If no session, show auth */}
      {!session && (
        <>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="EmailVerification" component={EmailVerification} />
        </>
        )}
      {/* Market list is the “landing page” for logged-in users */}
      {session && (
        <>
          <Stack.Screen name="MarketList" component={MarketList} />
          <Stack.Screen name="AddMarketScreen" options={{presentation: 'modal',
        }} component={AddMarketScreen}
      />
          <Stack.Screen name="EditMarketScreen" options={{presentation: 'modal',
        }} component={EditMarketScreen}
      />
          <Stack.Screen name="MainTabs">
            {(props) => <TabsNavigator {...props} session={session} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
