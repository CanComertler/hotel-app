
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favorite from './pages/Favorite';
import HotelDetail from './pages/HotelDetail';

export type FavoriteStackParamList = {
  Favorite: undefined;
  HotelDetail: { id: string };
};

const Stack = createNativeStackNavigator<FavoriteStackParamList>();

export default function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Favorite"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HotelDetail"
        component={HotelDetail}
        options={{ title: "Otel Detayı" }}
      />
    </Stack.Navigator>
  );
}
