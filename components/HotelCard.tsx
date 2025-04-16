import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Star } from "lucide-react-native";
import type { SearchStackParamList } from "../navigation/SearchStack";
import type { RootState } from "../redux/store"
import { toggleFavorite } from "../redux/favoritesSlice"; 

type Props = {
  id: number;
  name: string;
  city: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
};

type NavigationProp = NativeStackNavigationProp<SearchStackParamList, "HotelDetail">;

export const HotelCard = ({
  id,
  name,
  city,
  rating,
  pricePerNight,
  imageUrl,
}: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.favorites);
  const isFavorite = favorites.includes(id.toString());

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(id.toString()));
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("HotelDetail", { id: id.toString() })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="#e32f45"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View style={styles.row}>
          <Ionicons name="location" size={16} color="#4B5563" />
          <Text style={styles.city}>{city}</Text>
        </View>
        <View style={styles.row}>
          <Star size={16} color="#FBBF24" />
          <Text style={styles.rating}>{rating?.toFixed(1)} / 5</Text>
        </View>
        <Text style={styles.price}>{pricePerNight}₺ / gece</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#e32f45",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 4,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  city: {
    marginLeft: 4,
    color: "#4B5563",
    fontSize: 14,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
  },
});
