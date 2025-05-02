// pages/Login.tsx
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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.config";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleLogin = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Başarılı", "Giriş başarılı!");
      // Giriş yaptıktan sonra yönlendirme yapılabilir
      // navigation.navigate("Home"); // Örnek yönlendirme
    } catch (error: any) {
      Alert.alert("Giriş Hatası", error.message);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert("Şifremi Unuttum", "Şifre sıfırlama işlemi şu an aktif değil.");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Giriş Yap</Text>

      <Input label="E-posta" value={form.email} onChangeText={(v: string) => handleChange("email", v)} />
      <Input label="Şifre" value={form.password} secureTextEntry onChangeText={(v: string) => handleChange("password", v)} />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.signupLink}>
        <Text style={styles.signupText}>Hesabınız yok mu? <Text style={styles.signupHighlight}>Kayıt Ol</Text></Text>
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
    color: '#4B5563', // Dark Gray
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB', // Light Gray
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB', // Light Background
  },
  button: {
    backgroundColor: '#EF4444', // Red
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
  forgotPasswordLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#6B7280', // Gray Text
    fontWeight: 'bold',
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupText: {
    textAlign: 'center',
    color: '#6B7280', // Gray Text
  },
  signupHighlight: {
    color: '#EF4444', // Red
    fontWeight: 'bold',
  },
});
