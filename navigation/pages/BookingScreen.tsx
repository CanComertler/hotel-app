// navigation/pages/Booking.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  useRoute,
  RouteProp,
  useNavigation,
} from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { SearchStackParamList } from "../SearchStack";

type BookingRouteProp = RouteProp<SearchStackParamList, "Booking">;
const { width } = Dimensions.get("window");

export default function Booking() {
  const route = useRoute<BookingRouteProp>();
  const navigation = useNavigation();
  const auth = getAuth();

  const { hotel } = route.params;
  const nightly = hotel.pricePerNight;

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<"standard" | "vip">(
    "standard"
  );

  // date range helper...
  const getDatesInRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    let curr = new Date(start);
    const last = new Date(end);
    while (curr <= last) {
      dates.push(curr.toISOString().split("T")[0]);
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // markedDates build...
  const markedDates: Record<string, any> = {};
  if (startDate) {
    markedDates[startDate] = { startingDay: true, color: "#e32f45", textColor: "white" };
  }
  if (startDate && endDate) {
    const range = getDatesInRange(startDate, endDate);
    range.forEach((date) => {
      if (date === startDate || date === endDate) return;
      markedDates[date] = { color: "#ffc1c1", textColor: "black" };
    });
    markedDates[endDate] = { endingDay: true, color: "#e32f45", textColor: "white" };
  }

  const onDayPress = (day: { dateString: string }) => {
    const { dateString } = day;
    if (!startDate || (startDate && endDate)) {
      setStartDate(dateString);
      setEndDate("");
    } else if (startDate && !endDate) {
      if (new Date(dateString) < new Date(startDate)) {
        setStartDate(dateString);
      } else {
        setEndDate(dateString);
      }
    }
  };

  const nights = startDate && endDate
    ? getDatesInRange(startDate, endDate).length - 1
    : 0;

  const totalPrice = selectedRoom === "standard"
    ? nightly * nights
    : (nightly + 3000) * nights;

  const handleConfirm = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Lütfen rezervasyon için başlangıç ve bitiş tarihi seçin.");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: auth.currentUser?.uid,
        hotelName: hotel.name,
        city: hotel.city,
        date: `${startDate} - ${endDate}`,
        totalPrice,
        roomType: selectedRoom,
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        "Rezervasyon Talebiniz Oluşturuldu",
        "En kısa sürede otelden arama alacaksınız.",
        [
          {
            text: "Geri Dön",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Otel Adı */}
      <View style={styles.hotelBox}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
      </View>

      {/* Tarih Seçimi */}
      <Text style={styles.sectionTitle}>Tarih Aralığı Seçin</Text>
      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{ todayTextColor: "#e32f45", arrowColor: "#e32f45" }}
        style={styles.calendar}
      />

      {/* Oda Türü */}
      <Text style={styles.sectionTitle}>Oda Türü</Text>
      <View style={styles.roomTypeContainer}>
        <TouchableOpacity
          style={[
            styles.roomTypeButton,
            selectedRoom === "standard" && styles.roomTypeButtonActive,
          ]}
          onPress={() => setSelectedRoom("standard")}
        >
          <Text
            style={[
              styles.roomTypeText,
              selectedRoom === "standard" && styles.roomTypeTextActive,
            ]}
          >
            Standart Oda
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.roomTypeButton,
            selectedRoom === "vip" && styles.roomTypeButtonActive,
          ]}
          onPress={() => setSelectedRoom("vip")}
        >
          <Text
            style={[
              styles.roomTypeText,
              selectedRoom === "vip" && styles.roomTypeTextActive,
            ]}
          >
            VIP Oda
          </Text>
        </TouchableOpacity>
      </View>

      {/* Özeti */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Seçilen Oda:{" "}
          <Text style={styles.summaryValue}>
            {selectedRoom === "standard" ? "Standart" : "VIP"}
          </Text>
        </Text>
        <Text style={styles.summaryText}>
          Tarih Aralığı:{" "}
          <Text style={styles.summaryValue}>
            {startDate && endDate
              ? `${startDate} - ${endDate} (${nights} gece)`
              : "-"}
          </Text>
        </Text>
        <Text style={styles.summaryText}>
          Toplam Fiyat:{" "}
          <Text style={styles.summaryValue}>
            ₺{totalPrice} (₺
            {selectedRoom === "standard" ? nightly : nightly + 3000}
            /gün)
          </Text>
        </Text>
      </View>

      {/* Onay Butonu */}
      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Rezervasyonu Onayla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  hotelBox: {
    backgroundColor: "#fde8e8",
    padding: 16,
    alignItems: "center",
  },
  hotelName: { fontSize: 20, fontWeight: "bold", color: "#e32f45" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginHorizontal: 16,
  },
  calendar: {
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  roomTypeContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e32f45",
    borderRadius: 8,
    overflow: "hidden",
  },
  roomTypeButton: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  roomTypeButtonActive: {
    backgroundColor: "#e32f45",
  },
  roomTypeText: { color: "#e32f45", fontWeight: "600" },
  roomTypeTextActive: { color: "#fff" },
  summaryContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  summaryText: { fontSize: 16, marginBottom: 4 },
  summaryValue: { fontWeight: "600", color: "#333" },
  button: {
    margin: 16,
    backgroundColor: "#e32f45",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
