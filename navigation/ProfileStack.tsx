// navigation/ProfileStack.tsx
import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config";
import Update from "./pages/Update";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";



const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null; // Veya bir Loader gösterebilirsiniz

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Kullanıcı oturumu açıksa bu ekranları göster
        <>
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Update" component={Update} />
        </>
      ) : (
        // Oturum yoksa bu ekranları göster
        <>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Login" component={Login} />
        </>
      )}
    </Stack.Navigator>
  );
}
