import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: 'Home',       // sets header title globally
        headerStyle: { backgroundColor: '#6200ee' }, // header bg color
        headerTintColor: '#fff',   // back button & title color
      }}
    />
  );
}








