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
            animation: 'none'
          }}
        />
        <Stack.Screen name="addmeal" />
        <Stack.Screen name="addexercise_api" />
        <Stack.Screen name="comment_page" 
        options={{
          headerShown: true,
          headerTitle:''
        }}
        />
        <Stack.Screen name="comment_addfood" 
        options={{
          headerShown: true,
          headerTitle:'Customed Food Item',
          headerTitleAlign:'center'
        }}
        />
      </Stack>
    </UserProvider>
  );
}
