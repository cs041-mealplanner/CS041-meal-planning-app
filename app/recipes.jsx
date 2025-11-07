import { StyleSheet, Text, View } from 'react-native';

export default function GroceryList() {
    return(
        <View style={styles.container}>
            <Text>Recipe page</Text>
        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#f9e4bc',
  },
});