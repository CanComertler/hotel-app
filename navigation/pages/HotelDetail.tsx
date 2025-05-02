// pages/HotelDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.config";
import { SearchStackParamList } from "../SearchStack";
import TabButton, { TabButtonType } from "../../components/TabButton";

type HotelDetailRouteProp = RouteProp<SearchStackParamList, "HotelDetail">;
const { width } = Dimensions.get("window");

export default function HotelDetail() {
  const route = useRoute<HotelDetailRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [hotel, setHotel] = useState<{
    name: string;
    city: string;
    pricePerNight: number;
    rating: number;
    features: string[];
    imageUrl: string;
  } | null>(null);

  // 0 => standard, 1 => vip
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedRoom = selectedIndex === 0 ? "standard" : "vip";

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "hotels", id));
        if (snap.exists()) setHotel(snap.data() as any);
        else console.warn("Otel bulunamadı");
      } catch (e) {
        console.error("Otel verisi alınamadı:", e);
      }
    })();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: hotel?.name,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginLeft: 16, color: "#e32f45", fontSize: 18, marginRight: 16 }}>
            Geri Dön
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, hotel]);

  if (!hotel) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e32f45" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const thumbnails = Array(3).fill(hotel.imageUrl);
  const price =
    selectedRoom === "standard"
      ? hotel.pricePerNight
      : hotel.pricePerNight + 3000;

  const vipExtras = [
    "Odaya Kahvaltı",
    "Odaya Şarap ve Meyve Servisi",
    "Özel Süslemeli Oda",
    "1 Gece Alacarte Restorant Hakkı",
  ];
  const featuresToShow =
    selectedRoom === "vip"
      ? [...hotel.features, ...vipExtras]
      : hotel.features;

  const handleBooking = () => {
    navigation.navigate(
      "Booking" as never,
      {
        hotel,
        price,
        roomType: selectedRoom,
      } as never
    );
  };

  const roomButtons: TabButtonType[] = [
    { title: "Standart Oda" },
    { title: "VIP Oda" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={{ uri: hotel.imageUrl }} style={styles.coverImage} />
      </View>

      <View style={styles.thumbnailContainer}>
        {thumbnails.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.thumbnail} />
        ))}
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>{hotel.name}</Text>
        </View>

        <View style={styles.cityRatingContainer}>
          <Text style={styles.city}>{hotel.city}</Text>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
        </View>

        {/* TabButton ile oda tipi seçimi */}
        <TabButton
          buttons={roomButtons}
          selectedTab={selectedIndex}
          setSelectedTab={setSelectedIndex}
        />

        <Text style={styles.price}>₺{price} / gece</Text>

        <Text style={styles.featuresTitle}>Özellikler:</Text>
        {featuresToShow.map((feat, i) => (
          <Text key={i} style={styles.featureItem}>
            • {feat}
          </Text>
        ))}

        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  coverContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 240,
    borderRadius: 16,
  },
  thumbnailContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  thumbnail: {
    width: (width - 48) / 3,
    height: 80,
    borderRadius: 8,
  },
  detailsContainer: {
    marginHorizontal: 16,
    paddingBottom: 16,
  },
  titleBox: {
    backgroundColor: "#fde8e8",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#e32f45" },
  cityRatingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  city: { fontSize: 16, fontWeight: "bold", color: "#6B7280" },
  rating: { fontSize: 16, marginLeft: 8 },
  price: { fontSize: 20, fontWeight: "600", marginVertical: 16 },
  featuresTitle: { fontWeight: "bold", marginBottom: 4 },
  featureItem: { fontSize: 14, color: "#374151", marginBottom: 4 },
  bookButton: {
    backgroundColor: "#e32f45",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  bookButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
