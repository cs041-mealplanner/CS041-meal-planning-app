
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';

const router = useRouter();

export default function Home() {
  const loginPress = () => {
    console.log("Button pressed!");
    router.push("/login");
  };

  const signUpPress = () => {
    console.log("Button pressed!");
    router.push("/signup");
  };
  return (
    <View style={styles.container}>
      <Text>Welcome to the Meal Planning App!</Text>
      <Button mode="contained" onPress={loginPress} style={styles.button}>
        Login
      </Button>
      <Button mode="outlined" onPress={signUpPress} style={styles.button}>
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    marginTop: 20,
  },
});

