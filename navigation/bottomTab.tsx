import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Search from './pages/Search';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';

const Tab = createBottomTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,


        tabBarStyle: {
          position: 'absolute',
          bottom: 35,
          marginLeft: 40,
          marginRight: 40,
          height: 90,
          backgroundColor: '#ffffff',
          borderRadius: 50,
          elevation: 5,
          shadowColor: '#7F5D70',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        },

        tabBarItemStyle: {
          flex: 1,               
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIconStyle: {
          marginTop: 25,        
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="search" size={30} color={focused ? '#e32f45' : '#748c94'} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={Favorite}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="heart" size={30} color={focused ? '#e32f45' : '#748c94'} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person" size={30} color={focused ? '#e32f45' : '#748c94'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
