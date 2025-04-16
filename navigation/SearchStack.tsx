// navigation/SearchStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Search from '../navigation/pages/Search'; 
import HotelDetail from '../navigation/pages/HotelDetail'; 

export type SearchStackParamList = {
  Search: undefined;
  HotelDetail: { id: string }; 
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="HotelDetail"
        component={HotelDetail}
        options={{ title: 'Otel Detayı' }}
      />
      
    </Stack.Navigator>
  );
}
