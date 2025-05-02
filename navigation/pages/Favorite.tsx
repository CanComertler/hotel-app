import {
  View,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Text,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { FavoriteCard } from "../../components/FavoriteCard";

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
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#e32f45" />
        <Text style={styles.alert}>Favoriler yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (hotels.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.alert}>Henüz favori oteliniz yok.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.list}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FavoriteCard {...item} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  alert: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 22,
  },
  list: {
    flex: 1,
    padding: 10,
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
