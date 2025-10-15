// src/navigation/TabsNavigator.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabsParamList } from './types';
import Account from '../Screens/Account';
import AddItem from '../Screens/AddItem';

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsNavigator({ session }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Add Item" component={AddItem} />
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
