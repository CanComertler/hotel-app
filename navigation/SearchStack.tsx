// navigation/SearchStack.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "./pages/Search";
import HotelDetail from "./pages/HotelDetail";
import BookingScreen from "./pages/BookingScreen";

export type SearchStackParamList = {
  Search: undefined;
  HotelDetail: { id: string };
  Booking: {
    hotel: {
      name: string;
      city: string;
    };
    roomType: "standard" | "vip";
    price: number;
  };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="HotelDetail" component={HotelDetail} />
      <Stack.Screen name="Booking" component={BookingScreen} />
    </Stack.Navigator>
  );
}
