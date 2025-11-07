import { Image, ScrollView, StyleSheet, Text } from 'react-native';



export default function Dashboard() {
    return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Placeholder image */}
      <Image
        source={require("../assets/images/dashboard/dashboardplaceholder.png")}
        style={styles.placeholderImage}
      />

      <Text style={styles.caption}>Temporary photo of concept</Text>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#f9e4bc'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    button: {
        width: 200,
        marginTop: 20,
    },
    placeholderImage: {
    height: 350,
    resizeMode: "contain", 
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    },
    caption: {
    marginTop: 15,
    color: "#555",
    fontSize: 14,
  },
});