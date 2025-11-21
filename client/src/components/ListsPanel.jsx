import { useState } from "react";

export default function ListsPanel() {
    const [activeTab, setActiveTab] = useState("grocery");

    const [groceryItems, setGroceryItems] = useState([]);
    const [recipeItems, setRecipeItems] = useState([]);

    const [groceryInput, setGroceryInput] = useState("");
    const [recipeInput, setRecipeInput] = useState("");

    const handleAddItem = () => {
        if (activeTab === "grocery" && groceryInput.trim() !== "") {
            setGroceryItems([...groceryItems, groceryInput.trim()]);
            setGroceryInput("");
        }

        if (activeTab === "recipes" && recipeInput.trim() !== "") {
            setRecipeItems([...recipeItems, recipeInput.trim()]);
            setRecipeInput("");
        }
    };

    const handleDelete = (index) => {
        if (activeTab === "grocery") {
            setGroceryItems(groceryItems.filter((_, i) => i !== index));
        } else {
            setRecipeItems(recipeItems.filter((_, i) => i !== index));
        }
    };

    const handleEdit = (index) => {
        const newText = prompt("Edit item:");
        if (!newText) return;

        if (activeTab === "grocery") {
            const updated = [...groceryItems];
            updated[index] = newText;
            setGroceryItems(updated);
        } else {
            const updated = [...recipeItems];
            updated[index] = newText;
            setRecipeItems(updated);
        }
    };

    const items = activeTab === "grocery" ? groceryItems : recipeItems;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    onClick={() => setActiveTab("grocery")}
                    className={`px-4 py-2 font-medium ${activeTab === "grocery"
                            ? "border-b-2 border-blue-600"
                            : "text-gray-500"
                        }`}
                >
                    Grocery List
                </button>

                <button
                    onClick={() => setActiveTab("recipes")}
                    className={`px-4 py-2 font-medium ${activeTab === "recipes"
                            ? "border-b-2 border-blue-600"
                            : "text-gray-500"
                        }`}
                >
                    Recipe List
                </button>
            </div>

            {/* Add new item */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder={`Add new ${activeTab === "grocery" ? "grocery item" : "recipe"}`}
                    value={activeTab === "grocery" ? groceryInput : recipeInput}
                    onChange={(e) =>
                        activeTab === "grocery"
                            ? setGroceryInput(e.target.value)
                            : setRecipeInput(e.target.value)
                    }
                    className="border p-2 rounded-lg w-full"
                />

                <button
                    onClick={handleAddItem}
                    className="bg-blue-600 text-white px-4 rounded-lg"
                >
                    Add
                </button>
            </div>

            {/* Items */}
            <div className="space-y-3 text-gray-700">
                {items.length === 0 && (
                    <p className="text-gray-400 italic">
                        No items yet — add some above.
                    </p>
                )}

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                    >
                        <span>{item}</span>

                        <div className="flex gap-3 text-sm">
                            <button onClick={() => handleEdit(index)} className="text-blue-600 hover:underline">
                                Edit
                            </button>

                            <button onClick={() => handleDelete(index)} className="text-red-600 hover:underline">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
