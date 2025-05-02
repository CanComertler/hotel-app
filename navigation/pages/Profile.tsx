// pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabButton, { TabButtonType } from 'components/TabButton';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  Timestamp,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useNavigation } from '@react-navigation/native';

export enum CustomTab {
  Profile,
  Rezervasyonlarım,
}

type UserData = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  createdAt: Timestamp;
};

type Booking = {
  id: string;
  hotelName: string;
  city: string;
  date: string;
  totalPrice: number;
  roomType: 'standard' | 'vip';
  createdAt: Timestamp;
};

const Profile = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<CustomTab>(CustomTab.Profile);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const buttons: TabButtonType[] = [
    { title: 'Profil' },
    { title: 'Rezervasyonlarım' },
  ];

  // Profil bilgisini bir kez çek
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingProfile(true);
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        }
      } catch (error) {
        console.error('Kullanıcı verisi alınamadı:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUserData();
  }, []);

  // Rezervasyonları yalnızca Rezervasyonlarım sekmesine geçince çek
  useEffect(() => {
    if (selectedTab !== CustomTab.Rezervasyonlarım) return;
    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const auth = getAuth();
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', uid),
          orderBy('createdAt', 'desc')   // composite index hazır olmalı
        );
        const snap = await getDocs(q);
        const list: Booking[] = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setBookings(list);
      } catch (error) {
        console.error('Rezervasyonlar alınamadı:', error);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, [selectedTab]);

  const renderProfile = () => {
    if (loadingProfile) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#e32f45" />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      );
    }
    if (!userData) {
      return <Text style={styles.loadingText}>Kullanıcı bilgisi bulunamadı.</Text>;
    }
    const { firstName, lastName, username, email, phone, createdAt } = userData;
    const date = createdAt.toDate
      ? createdAt.toDate()
      : new Date(createdAt.seconds * 1000);

    return (
      <>
        <View style={styles.card}>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kullanıcı Adı:</Text>
            <Text style={styles.value}>{username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>E-posta:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Telefon:</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Kayıt Tarihi:</Text>
            <Text style={styles.value}>{date.toLocaleDateString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => navigation.navigate('Update' as never)}
        >
          <Text style={styles.updateButtonText}>Profili Güncelle</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderBookings = () => {
    if (loadingBookings) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#e32f45" />
          <Text style={styles.loadingText}>Rezervasyonlar yükleniyor...</Text>
        </View>
      );
    }
    if (bookings.length === 0) {
      return <Text style={styles.loadingText}>Henüz rezervasyonunuz yok.</Text>;
    }
    return bookings.map(b => (
      <View key={b.id} style={styles.bookingCard}>
        <Text style={styles.bookingHotel}>{b.hotelName}</Text>
        <Text style={styles.bookingText}>Tarih: {b.date}</Text>
        <Text style={styles.bookingText}>Oda: {b.roomType === 'standard' ? 'Standart' : 'VIP'}</Text>
        <Text style={styles.bookingPrice}>₺{b.totalPrice}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <TabButton
        buttons={buttons}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {selectedTab === CustomTab.Profile
          ? renderProfile()
          : renderBookings()
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f7f7' },
  container: { padding: 20 },
  centered: { alignItems: 'center', marginTop: 40 },
  loadingText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e32f45',
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  label: { width: 120, fontWeight: '600', color: '#374151' },
  value: { flex: 1, color: '#111827' },
  updateButton: {
    backgroundColor: '#e32f45',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHotel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e32f45',
    marginBottom: 6,
  },
  bookingText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
  },
});
