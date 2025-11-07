
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Menu } from "react-native-paper";

// Universal Header Component
// Pleased note that this iteration currently does not
// check authentication status to modify menu options.
// Additionally, some of the pages linked here may not yet exist
// and will need to be created.




export default function Header() {
  const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const navigateTo = (path) => {
        closeMenu();
        router.push(path);
    };



  return (
    <View style={styles.header}>
      {/* Left side — Logo + App name */}
      <View style={styles.leftSection}>
        <Pressable 
            style={({ pressed }) => [
                styles.brandContainer,
                { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => router.push("/")}    
        >
        <Image
          source={require("../assets/images/nourishlylogonoears.png")}
          style={styles.logo}
        />
        <Text style={styles.brandText}>Nourishly</Text>
        </Pressable>
      </View>

      {/* Middle — Nav links */}
      <View style={styles.centerContainer}>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push("/discover")}>
            <Text style={styles.link}>Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/get-started")}>
            <Text style={styles.link}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/about")}>
            <Text style={styles.link}>About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right side — menu icon */}
       <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Ionicons name="menu-outline" size={26} color="#5b7a6d" />
            </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}
        >
        <Menu.Item onPress={() => router.push("/dashboard")} title="Dashboard" />
        <Menu.Item onPress={() => router.push("/create-meal-plan")} title="Create Meal Plan" />
        <Menu.Item onPress={() => router.push("/recipes")} title="Your Recipes" />
        <Menu.Item onPress={() => router.push("/grocery-list")} title="Grocery List" />
        <Menu.Item onPress={() => router.push("/settings")} title="Settings" />
        </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f8f9f4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: " space-between",
    paddingHorizontal: 24,

    // Drop shadow 
    shadowColor: "#000",         // iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.5,          // iOS shadow opacity
    shadowRadius: 7,             // iOS shadow blur radius
    elevation: 5,                // Android shadow depth
    zIndex: 2,                  // keep above content if needed
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 6,
    resizeMode: "contain",
  },
  brandText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5b7a6d",
  },
  brandContainer:{
    flexDirection: "row",
    alignItems: "center",
  },
  navLinks: {
    flexDirection: "row",
    allighnItems: "center",
    gap: 18,
    
  },
  link: {
    fontSize: 15,
    color: "#5b7a6d",
    fontWeight: "500",
  },
  centerContainer:{
    position: "absolute",
    left: "50%",
    right: "50%",
    alighnItems: "center",
    transform: [{ translateX: -165 }, { translateY: 0 }],
  },
});
