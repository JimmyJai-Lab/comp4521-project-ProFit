import { Stack } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useEffect } from "react";
import { UserProvider } from '../contexts/UserContext';


export default function RootLayout() {
  useEffect(() => {
    setStatusBarStyle("dark");
  }, []);

  return (
    <UserProvider>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="addmeal"
          options={{
            headerShown: true,
            headerTitle: "Add Meal",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="addmeal_api"
          options={{
            headerShown: true,
            headerTitle: "Search Items",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen name="addexercise_api" />
        <Stack.Screen
          name="comment_page"
          options={{
            headerShown: true,
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="comment_addfood"
          options={{
            headerShown: true,
            headerTitle: "Custom Food Items",
            headerTitleAlign: "center",
          }}
        />
      </Stack>
    </UserProvider>
  );
}
