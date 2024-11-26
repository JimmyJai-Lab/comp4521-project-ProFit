import { Tabs, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View } from 'react-native-reanimated/lib/typescript/Animated';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
      tabBarActiveTintColor: '#A020F0',
      headerStyle: {
        backgroundColor: '#FFFCF6',
      },
      headerShadowVisible: false,
      headerTintColor: '#000000',
      tabBarStyle: {
      backgroundColor: '#FFFCF6',
      },
    }}
    >
      <Tabs.Screen name="index" options={{
        href: null, 
        title: 'Home',
        tabBarStyle: {display: "none"},
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="signup" options={{
        href: null, 
        headerShown: false,
        title: 'Signup',
        tabBarStyle: {display: "none"},
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        ),
      }} />
      <Tabs.Screen name="fitness" options={{ 
        title: 'Fitness', 
        tabBarIcon: ({ color, focused }) => (
          <MaterialIcons name="fitness-center" size={24} color= {color} />
        ),
      }} />
      <Tabs.Screen name="diet" options={{ 
        headerShown: false,
        title: 'Diet', 
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'fast-food' : 'fast-food-outline'} color={color} size={24}/>
        ),
      }} />
      <Tabs.Screen name="community" options={{ 
        title: 'Community',
        headerStyle:{height:40},
        headerTitle:'ProFit',
        headerTitleAlign: 'center',
        tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={24}/>
        ),
      }} />
      <Tabs.Screen name="profile" options={{ 
        title: 'Profile', 
        tabBarIcon: ({ color, focused }) => (
          <AntDesign name="profile" size={24} color={color} />
        ),
      }} />
    </Tabs>
  );
}