import { Edit, Plus, Trash2 } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORY_KEYWORDS = {
  Bakery: ["bread", "bagel", "bun", "croissant", "roll"],
  "Condiments & Dressings": ["ketchup", "mustard", "salsa", "bbq", "mayo", "vinegar"],
  "Cooking & Baking": ["flour", "sugar", "yeast", "baking", "spice"],
  Dairy: ["milk", "cheese", "butter", "yogurt", "cream"],
  Deli: ["ham", "turkey", "salami", "bacon", "deli", "sandwich"],
  "Grains, Pasta & Sides": ["pasta", "rice", "tortilla", "noodle", "quinoa"],
  Produce: ["apple", "banana", "lettuce", "tomato", "onion", "carrot", "spinach"],
  Meat: ["chicken", "beef", "pork", "steak", "sausage", "fish", "shrimp"],
  Frozen: ["ice cream", "frozen", "fries", "pizza"],
  Snacks: ["chips", "cookies", "crackers", "popcorn"],
  Beverages: ["juice", "soda", "coffee", "tea", "water"],
};

function detectCategory(itemName) {
  const lowerName = itemName.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lowerName.includes(kw))) {
      return category;
    }
  }
  return "Uncategorized";
}

export default function GroceryList() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState({});
  const [editing, setEditing] = useState({ category: null, index: null, text: "" });

  const addItem = () => {
    if (!inputValue.trim()) return;

    const category = detectCategory(inputValue.trim());

    setItems((prev) => ({
      ...prev,
      [category]: prev[category]
        ? [...prev[category], { name: inputValue }]
        : [{ name: inputValue }],
    }));

    setInputValue("");
  };

  const removeItem = (category, index) => {
    setItems((prev) => {
      const newCategoryItems = prev[category].filter((_, i) => i !== index);
      const updatedItems = { ...prev };
      if (newCategoryItems.length === 0) {
        delete updatedItems[category];
      } else {
        updatedItems[category] = newCategoryItems;
      }
      return updatedItems;
    });
  };

  const startEditing = (category, index, currentName) => {
    setEditing({ category, index, text: currentName });
  };

  const saveEdit = () => {
    if (!editing.text.trim()) return;

    const category = detectCategory(editing.text);
    setItems((prev) => {
      const updated = { ...prev };

      // Remove from old category if moved
      const oldItems = updated[editing.category].filter(
        (_, i) => i !== editing.index
      );

      if (oldItems.length === 0) {
        delete updated[editing.category];
      } else {
        updated[editing.category] = oldItems;
      }

      // Add to new category
      updated[category] = updated[category]
        ? [...updated[category], { name: editing.text }]
        : [{ name: editing.text }];

      return updated;
    });

    setEditing({ category: null, index: null, text: "" });
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === "Enter") {
      addItem();
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          onKeyPress={handleKeyPress}
          placeholder="Add grocery item..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Plus color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      {/* Grocery Categories */}
      <FlatList
        data={Object.keys(items)}
        keyExtractor={(cat) => cat}
        renderItem={({ item: category }) => (
          <View style={styles.categoryBlock}>
            <Text style={styles.categoryTitle}>{category}</Text>
            {items[category].map((grocery, index) => {
              const isEditing =
                editing.category === category && editing.index === index;
              return (
                <View key={index} style={styles.itemRow}>
                  {isEditing ? (
                    <TextInput
                      style={styles.editInput}
                      value={editing.text}
                      onChangeText={(text) =>
                        setEditing({ ...editing, text })
                      }
                      onSubmitEditing={saveEdit}
                      onBlur={saveEdit}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.itemText}>{grocery.name}</Text>
                  )}

                  <View style={styles.iconRow}>
                    {!isEditing && (
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() =>
                          startEditing(category, index, grocery.name)
                        }
                      >
                        <Edit color="#5b7a6d" size={18} />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={() => removeItem(category, index)}
                    >
                      <Trash2 color="#c00" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9e6c7",
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#5b7a6d",
    marginLeft: 8,
    padding: 10,
    borderRadius: 8,
  },
  categoryBlock: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginBottom: 16,
    paddingBottom: 8,
  },
  categoryTitle: {
    backgroundColor: "#4e8578",
    color: "#fff",
    fontWeight: "bold",
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 2,
    marginHorizontal: 8,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editInput: {
    flex: 1,
    backgroundColor: "#eef",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontSize: 16,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 8,
  },
});
