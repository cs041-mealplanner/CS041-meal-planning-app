import { useEffect, useState } from 'react';
import { getGroceryItems, saveGroceryItems } from '../features/grocery/groceryStorage';

const sortGroceryItems = (items) => {
    return [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
};

function GroceryList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Produce' });
    const [groceryItems, setGroceryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadItems() {
            try {
                const items = await getGroceryItems();

                if (isMounted) {
                    setGroceryItems(sortGroceryItems(items));
                }
            } catch (error) {
                console.error('Failed to load grocery items:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadItems();

        return () => {
            isMounted = false;
        };
    }, []);

    const defaultCategories = ['Produce', 'Meat & Poultry', 'Pantry', 'Spices & Seasonings', 'Dairy'];

    const persistItems = async (nextItems) => {
        const previousItems = groceryItems;
        setGroceryItems(nextItems);

        try {
            await saveGroceryItems(nextItems, previousItems);
            return true;
        } catch (error) {
            console.error('Failed to save grocery items:', error);
            setGroceryItems(previousItems);
            alert(error.message || 'We could not save your grocery list right now.');
            return false;
        }
    };

    const toggleCheck = async (id) => {
        const nextItems = sortGroceryItems(groceryItems.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));

        await persistItems(nextItems);
    };

    const removeItem = async (id) => {
        const nextItems = groceryItems.filter((item) => item.id !== id);
        await persistItems(nextItems);
    };

    const clearChecked = async () => {
        if (!window.confirm('Are you sure? (Deleting checked items)')) {
            return;
        }

        const nextItems = groceryItems.filter((item) => !item.checked);
        await persistItems(nextItems);
    };

    const addNewGroceryItem = async () => {
        if (newItem.name.trim() && newItem.quantity.trim()) {
            const nextItems = sortGroceryItems([...groceryItems, {
                id: `grocery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                name: newItem.name,
                source: 'Manual',
                quantity: newItem.quantity,
                category: newItem.category,
                checked: false
            }]);

            const didSave = await persistItems(nextItems);

            if (didSave) {
                setNewItem({ name: '', quantity: '', category: 'Produce' });
                setShowAddForm(false);
            }
        }
    };

    const shareList = () => {
        alert('Share functionality coming soon!');
    };

    const checkAllInCategory = async (category) => {
        const nextItems = sortGroceryItems(groceryItems.map((item) =>
            item.category === category ? { ...item, checked: true } : item
        ));

        await persistItems(nextItems);
    };

    const filteredItems = groceryItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = Array.from(new Set([
        ...defaultCategories,
        ...filteredItems
            .map((item) => item.category)
            .filter(Boolean)
    ]));

    const getItemsByCategory = (category) => {
        return filteredItems.filter((item) => item.category === category);
    };

    const totalItems = groceryItems.length;
    const checkedItems = groceryItems.filter((item) => item.checked).length;
    const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#E8E3D8]">
            <div className="max-w-3xl mx-auto px-3 py-6 sm:px-4 sm:py-8">
                <div className="bg-white rounded-lg shadow-sm p-4 mb-5 sm:p-6 sm:mb-6">
                    <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">My Grocery List</h1>
                        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
                            {checkedItems > 0 && (
                                <button
                                    onClick={clearChecked}
                                    className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors sm:w-auto"
                                >
                                    Clear Checked ({checkedItems})
                                </button>
                            )}
                            <button
                                onClick={shareList}
                                className="w-full px-4 py-2 text-sm bg-[#6B8E6F] text-white rounded-md hover:bg-[#5a7a5e] transition-colors sm:w-auto"
                            >
                                Share List
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="max-w-24 break-words text-right text-sm text-gray-600 sm:max-w-none">Shopping progress</span>
                            <span className="text-sm font-medium text-gray-700">{checkedItems}/{totalItems}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-[#6B8E6F] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-3 mb-5 sm:p-4 sm:mb-6">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] focus:border-transparent"
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    {isLoading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading your grocery list...
                        </div>
                    ) : totalItems === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-5xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your grocery list is empty</h3>
                            <p className="text-gray-500 mb-6">Add ingredients from recipes or manually add items below</p>
                        </div>
                    ) : (
                        <>
                            {categories.map((category) => {
                                const categoryItems = getItemsByCategory(category);
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={category} className="mb-6 last:mb-0">
                                        <div className="flex flex-col gap-2 mb-3 pb-2 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between">
                                            <h2 className="text-sm font-semibold text-gray-700">{category}</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="break-words text-xs text-gray-500">{categoryItems.length} items</span>
                                                <button
                                                    onClick={() => checkAllInCategory(category)}
                                                    className="text-xs text-[#6B8E6F] hover:underline"
                                                >
                                                    Check all
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {categoryItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start justify-between gap-3 py-3 group hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                                                >
                                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.checked}
                                                            onChange={() => toggleCheck(item.id)}
                                                            className="w-4 h-4 text-[#6B8E6F] border-gray-300 rounded focus:ring-[#6B8E6F] cursor-pointer"
                                                        />
                                                        <div className={`min-w-0 ${item.checked ? 'opacity-50' : ''}`}>
                                                            <div className={`break-words text-sm font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                                {item.name}
                                                            </div>
                                                            <div className="break-words text-xs text-gray-500">{item.source}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                                        <span className="max-w-24 break-words text-right text-sm text-gray-600 sm:max-w-none">{item.quantity}</span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        {!showAddForm ? (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#6B8E6F] hover:text-[#6B8E6F] transition-colors"
                            >
                                + Add New Item
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Item name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Quantity"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                    />
                                </div>
                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                >
                                    {defaultCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <button
                                        onClick={addNewGroceryItem}
                                        className="flex-1 px-4 py-2 bg-[#6B8E6F] text-white rounded-md hover:bg-[#5a7a5e] transition-colors"
                                    >
                                        Add Item
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewItem({ name: '', quantity: '', category: 'Produce' });
                                        }}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-10 px-4 pb-8 text-center text-sm text-gray-500 sm:mt-12">
                © Nourishly 2025 • <a href="#" className="hover:text-gray-700">Privacy</a> • <a href="#" className="hover:text-gray-700">Terms</a>
            </footer>
        </div>
    );
}

export default GroceryList;
