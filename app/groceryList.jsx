import { StyleSheet, Text, View } from 'react-native';

export default function GroceryList() {
    return(
        <View style={styles.container}>
            <Text>Grocery List Page</Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9e4bc',
  },
});
