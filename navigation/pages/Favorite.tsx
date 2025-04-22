import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Text,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { FavoriteCard } from "../../components/FavoriteCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SearchStackParamList } from "../SearchStack";

type Hotel = {
  id: number;
  name: string;
  city: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
};

export default function Favorite() {
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation =
    useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

  const fetchFavoriteHotels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hotels"));
      const allHotels: Hotel[] = querySnapshot.docs.map((doc) => ({
        id: doc.data().id,
        name: doc.data().name,
        city: doc.data().city,
        rating: doc.data().rating,
        pricePerNight: doc.data().pricePerNight,
        imageUrl: doc.data().imageUrl,
      }));

      const filteredHotels = allHotels.filter((hotel) =>
        favoriteIds.includes(hotel.id.toString())
      );

      setHotels(filteredHotels);
    } catch (error) {
      console.error("Favori oteller alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteHotels();
  }, [favoriteIds]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#e32f45" />
        <Text className="mt-2 text-gray-500">Favoriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (hotels.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white mt-4">
        <Text className="text-gray-500 text-lg">Henüz favori oteliniz yok.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-4">
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FavoriteCard {...item} navigation={navigation} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
