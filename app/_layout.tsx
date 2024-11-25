import { Stack } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle("dark");
    }, 0);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false}}/>
      <Stack.Screen name="+not-found"/>
      <Stack.Screen name="addmeal" options={{ 
        title: 'Add Meal',
        headerTitleAlign:'center',
      }} />
      <Stack.Screen name="addexercise_api" options={{ 
        title: 'Add Exercise',
        headerTitleAlign:'center',
      }} />
    </Stack>
  );
}
