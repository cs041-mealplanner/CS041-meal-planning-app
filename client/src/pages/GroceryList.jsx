
import { useEffect, useState } from 'react';


function GroceryList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Produce' });


    // load items from localStorage and start with empty list
    const loadGroceryItems = () => {
        const saved = localStorage.getItem('groceryList');
        if (saved) {
            return JSON.parse(saved);
        }

        // if start with empty list
        return [];
    };


    const [groceryItems, setGroceryItems] = useState(loadGroceryItems);

    // save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('groceryList', JSON.stringify(groceryItems));
    }, [groceryItems]);


    const categories = ['Produce', 'Meat & Poultry', 'Pantry', 'Spices & Seasonings', 'Dairy'];

    const toggleCheck = (id) => {
        setGroceryItems(items =>
            items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };


    const removeItem = (id) => {
        setGroceryItems(items => items.filter(item => item.id !== id));
    };


    const clearChecked = () => {
        setGroceryItems(items => items.filter(item => !item.checked));
    };


    const clearAll = () => {
        if (window.confirm('Are you sure you want to clear your entire grocery list?')) {
            setGroceryItems([]);
            localStorage.removeItem('groceryList');
        }
    };


    const addNewGroceryItem = () => {
        if (newItem.name.trim() && newItem.quantity.trim()) {
            const newId = groceryItems.length > 0
                ? Math.max(...groceryItems.map(i => i.id)) + 1
                : 1;

            setGroceryItems([...groceryItems, {
                id: newId,
                name: newItem.name,
                source: 'Manual',
                quantity: newItem.quantity,
                category: newItem.category,
                checked: false
            }]);

            setNewItem({ name: '', quantity: '', category: 'Produce' });
            setShowAddForm(false);
        }
    };

    // WILL ADD MORE
    const shareList = () => {
        // MINT TO DO : implement share functionality (talk with the team--share to what/where)
        alert('Share functionality coming soon!');
    };

    const checkAllInCategory = (category) => {
        setGroceryItems(items =>
            items.map(item =>
                item.category === category ? { ...item, checked: true } : item
            )
        );
    };


    const filteredItems = groceryItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const getItemsByCategory = (category) => {
        return filteredItems.filter(item => item.category === category);
    };


    const totalItems = groceryItems.length;
    const checkedItems = groceryItems.filter(item => item.checked).length;
    const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;


    return (
        <div className="min-h-screen bg-[#E8E3D8]">
            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">My Grocery List</h1>
                        <div className="flex gap-3">
                            {checkedItems > 0 && (
                                <button
                                    onClick={clearChecked}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    Clear Checked ({checkedItems})
                                </button>
                            )}

                            {totalItems > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                            <button
                                onClick={shareList}
                                className="px-4 py-2 text-sm bg-[#6B8E6F] text-white rounded-md hover:bg-[#5a7a5e] transition-colors"
                            >
                                Share List
                            </button>
                        </div>
                    </div>


                    {/* Progress Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Shopping progress</span>
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


                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] focus:border-transparent"
                    />
                </div>


                {/* Items List by Category */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {totalItems === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-5xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your grocery list is empty</h3>
                            <p className="text-gray-500 mb-6">Add ingredients from recipes or manually add items below</p>
                        </div>
                    ) : (
                        <>
                            {categories.map(category => {
                                const categoryItems = getItemsByCategory(category);
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={category} className="mb-6 last:mb-0">
                                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                                            <h2 className="text-sm font-semibold text-gray-700">{category}</h2>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">{categoryItems.length} items</span>
                                                <button
                                                    onClick={() => checkAllInCategory(category)}
                                                    className="text-xs text-[#6B8E6F] hover:underline"
                                                >
                                                    Check all
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {categoryItems.map(item => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between py-2 group hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.checked}
                                                            onChange={() => toggleCheck(item.id)}
                                                            className="w-4 h-4 text-[#6B8E6F] border-gray-300 rounded focus:ring-[#6B8E6F] cursor-pointer"
                                                        />
                                                        <div className={item.checked ? 'opacity-50' : ''}>
                                                            <div className={`text-sm font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                                {item.name}
                                                            </div>
                                                            <div className="text-xs text-gray-500">{item.source}</div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm text-gray-600">{item.quantity}</span>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
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


                    {/* Add New Item Section */}
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
                                <div className="grid grid-cols-2 gap-3">
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
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <div className="flex gap-2">
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


            {/* Footer */}
            <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
                © Nourishly 2025 • <a href="#" className="hover:text-gray-700">Privacy</a> • <a href="#" className="hover:text-gray-700">Terms</a>
            </footer>
        </div>
    );
}

export default GroceryList;