import { Stack, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import Header from "../components/Header";


const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: 'green',
    accent: 'green',
    background: '#f9e4bc',
    onbackground: '#000000',
  },
  

}



export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  return (
      <PaperProvider theme={theme}>
        {/* Universal Header */}
        <Header />

        {/* Expo Router Pages */}
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
  );
}


// Styles for the header
const styles = StyleSheet.create({
  // Ignore
  container:{
    flex: 1,
    backgroundColor: '#000000ff',
  },
 
});




