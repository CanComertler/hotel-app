// pages/SignUp.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function SignUp() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignUp = async () => {
    const { firstName, lastName, username, email, phone, password } = form;

    if (!firstName || !lastName || !username || !email || !phone || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        username,
        email,
        phone,
        createdAt: new Date(),
      });

      Alert.alert("Başarılı", "Kayıt başarılı! Giriş yapıldı.");
      // Otomatik giriş zaten oldu
    } catch (error: any) {
      Alert.alert("Kayıt Hatası", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>

      <Input label="Ad" value={form.firstName} onChangeText={(v: string) => handleChange("firstName", v)} />
      <Input label="Soyad" value={form.lastName} onChangeText={(v: string) => handleChange("lastName", v)} />
      <Input label="Kullanıcı Adı" value={form.username} onChangeText={(v: string) => handleChange("username", v)} />
      <Input label="Email" value={form.email} keyboardType="email-address" onChangeText={(v: string) => handleChange("email", v)} />
      <Input label="Telefon" value={form.phone} keyboardType="phone-pad" onChangeText={(v: string) => handleChange("phone", v)} />
      <Input label="Şifre" value={form.password} secureTextEntry onChangeText={(v: string) => handleChange("password", v)} />

      <TouchableOpacity
        onPress={handleSignUp}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
        <Text style={styles.loginText}>Zaten bir hesabınız var mı? <Text style={styles.loginHighlight}>Giriş yap</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Input = ({ label, ...props }: any) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#4B5563', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', 
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB', 
  },
  button: {
    backgroundColor: '#EF4444', 
    paddingVertical: 16,
    borderRadius: 50,
    marginTop: 24,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 16,
  },
  loginText: {
    textAlign: 'center',
    color: '#6B7280', 
  },
  loginHighlight: {
    color: '#EF4444', 
    fontWeight: 'bold',
  },
});
