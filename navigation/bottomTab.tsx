import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Search from './pages/Search';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import React, { useRef, useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import SearchStack from './SearchStack';
import FavoriteStack from './FavoriteStack';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');


const TAB_MARGIN = 40;    
const SLIDE_SIZE = 70;     


const tabBarWidth = width - TAB_MARGIN * 2;
const tabWidth    = tabBarWidth / 3;

const initialLeft = (tabWidth - SLIDE_SIZE) / 2;

export default function MyTabs() {
  const translateX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);


  const moveIndicator = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    moveIndicator(currentIndex);
  }, [currentIndex]);

  return (

    
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,


        tabBarStyle: {
          position: 'absolute',
          bottom: 35,
          marginLeft: TAB_MARGIN,
          marginRight: TAB_MARGIN,
          height: 90,
          backgroundColor: '#e32f45',
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

        tabBarActiveTintColor: '#e32f45',
        tabBarInactiveTintColor: '#ffffff',

        tabBarBackground: () => (
          <Animated.View
            style={[
              styles.slidingTab,
              {
                left: initialLeft,
                transform: [{ translateX }],
              },
            ]}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchStack}
        listeners={{ tabPress: () => setCurrentIndex(0) }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteStack} 
        listeners={{ tabPress: () => setCurrentIndex(1) }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={30} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={{ tabPress: () => setCurrentIndex(2) }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  slidingTab: {
    position: 'absolute',
    bottom: 10,
    width: SLIDE_SIZE,
    height: SLIDE_SIZE,
    borderRadius: SLIDE_SIZE / 2,
    backgroundColor: 'white',
  },
});
