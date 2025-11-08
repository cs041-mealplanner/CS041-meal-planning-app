import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";



export default function RecipeScreen() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

 

  const searchRecipes = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${search}&number=10&apiKey=c626b854fb88461dba5ae81ecee4c464
`
      );
      const data = await res.json();
      console.log("First recipe:", data.results?.[0]);
      setRecipes(data.results || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipe) => {
    setSavedRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      if (exists) {
        return prev.filter((r) => r.id !== recipe.id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const renderRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
        {item.image ? (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        ) : (
        <View style={[styles.recipeImage, { backgroundColor: "#ddd" }]} />
        )}
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => addToSaved(item)} style={styles.iconButton}>
        <Ionicons name="add-circle-outline" size={24} color="green" />
        </TouchableOpacity>
    </View>
    );

  const renderSavedRecipe = ({ item }) => (
    <View style={styles.recipeCard}>
        {item.image ? (
        <Image source={{ uri: item.image }} style={styles.recipeImage} />
        ) : (
        <View style={[styles.recipeImage, { backgroundColor: "#ddd" }]} />
        )}
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => removeFromSaved(item)} style={styles.iconButton}>
        <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
    </View>
    );

  return (
    <View style={styles.container}>
      {/* LEFT: Search Recipes */}
      <View style={styles.column}>
        <Text style={styles.title}>Search Recipes</Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for recipes..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchRecipes}
          />
          <TouchableOpacity onPress={searchRecipes} style={styles.searchButton}>
            <Ionicons name="search" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {loading && <Text>Loading recipes...</Text>}
        {!loading && recipes.length > 0 && (
          <Text style={styles.resultCount}>Found {recipes.length} results</Text>
        )}

        <FlatList
          data={recipes}
          renderItem={renderRecipe}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      {/* RIGHT: Saved Recipes */}
      <View style={[styles.column, styles.savedColumn]}>
        <Text style={styles.title}>Saved Recipes</Text>

        {savedRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No recipes saved yet.</Text>
        ) : (
          <FlatList
            data={savedRecipes}
            renderItem={renderSavedRecipe}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", 
    backgroundColor: "#FFE8C2",
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  column: {
    flex: 1,
    flexDirection: "column",
  },
  savedColumn: {
    borderLeftWidth: 1,
    borderLeftColor: "#ccc",
    paddingLeft: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3A3A3A",
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchButton: {
    backgroundColor: "green",
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 45,
  },
  recipeCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    objectFit: "cover",
    marginRight: 8,
  },
  recipeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  recipeTitle: {
    flex: 1, 
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginRight: 10, 
  },
  resultCount: {
    marginVertical: 6,
    fontSize: 14,
    color: "#444",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  iconButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
