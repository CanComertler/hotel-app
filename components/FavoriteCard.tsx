import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Star } from "lucide-react-native";
import { useDispatch } from "react-redux";
import { removeFromFavorites } from "../redux/favoritesSlice";

type Props = {
  id: number;
  name: string;
  city: string;
  rating: number;
  pricePerNight: number;
  imageUrl: string;
};

export const FavoriteCard = ({
  id,
  name,
  city,
  rating,
  pricePerNight,
  imageUrl,
}: Props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.city}>{city}</Text>
        <View style={styles.row}>
          <Star size={16} color="#FBBF24" />
          <Text style={styles.rating}>{rating.toFixed(1)} / 5</Text>
        </View>
        <Text style={styles.price}>{pricePerNight}₺ / gece</Text>
      </View>

      <TouchableOpacity
        style={styles.removeIcon}
        onPress={() => dispatch(removeFromFavorites(id.toString()))}
      >
        <Ionicons name="heart-dislike" size={22} color="#e32f45" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#e32f45",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
  },
  city: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#333",
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
    color: "#10B981",
  },
  removeIcon: {
    padding: 8,
  },
});
