// src/navigation/types.ts
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MarketDataCurr, MarketDataSendToBooth } from "../Screens/Market/types";

// Root stack routes (your main app flow)
export type RootStackParamList = {
  Onboarding?: undefined;
  Auth: undefined;
  EmailVerification: undefined;
  MarketList: undefined;
  MainTabs: undefined;
  AddMarketScreen: undefined;
  EditMarketScreen: MarketDataCurr;
  AddBooth: undefined;
  EditCustomBooth: undefined;
};

// Bottom tab routes
export type TabsParamList = {
  // 'Add Item': undefined;
  Account: undefined;
  "View Booths": MarketDataSendToBooth;
  "View Items": undefined;
};

// Example: Navigation prop type for the Account screen
export type AccountScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabsParamList, "Account">,
  NativeStackNavigationProp<RootStackParamList>
>;
