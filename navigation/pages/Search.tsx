import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.config";
import { HotelCard } from "../../components/HotelCard";

type Hotel = {
  id: number;
  name: string;
  city: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
};

export default function Search() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "hotels"));
      const data: Hotel[] = querySnapshot.docs.map((doc) => ({
        id: doc.data().id,
        name: doc.data().name,
        city: doc.data().city,
        rating: doc.data().rating,
        pricePerNight: doc.data().pricePerNight,
        imageUrl: doc.data().imageUrl,
      }));
      setHotels(data);
    } catch (error) {
      console.error("Otel verileri alınamadı:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e32f45" />
        <Text style={styles.loadingText}>Oteller yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shadowWrapper}>
            <HotelCard {...item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 36,
    paddingBottom: 16,
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  shadowWrapper: {
    flex: 1,
    margin: 8,
    // Shadow ayarları: Kartın dışındaki container'a tanımlandığı için overflow kullanmıyoruz
    shadowColor: "#e32f45",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6, // Android için
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#6B7280",
  },
});
