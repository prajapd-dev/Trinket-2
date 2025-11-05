// src/navigation/TabsNavigator.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabsParamList } from "./types";
import Account from "../Screens/Account";
import BoothList from "../Screens/Booth/BoothList";
import { IconButton } from "react-native-paper";

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator({ session }: any) {
  console.log("TabsNavigator: marketId: ");
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="View Booths"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconName = focused ? "shopping" : "shopping-outline";
            return <IconButton icon={iconName} />;
          },
        }}
      >
        {(props) => <BoothList {...props} />}
      </Tab.Screen>
      <Tab.Screen name="Account">
        {(props) =>
          session && session.user ? (
            <Account {...props} session={session} />
          ) : null
        }
      </Tab.Screen>
    </Tab.Navigator>
  );
}
