import { useEffect, useState } from 'react';
import { generateFromMealPlan, getWeekDishNames } from '../features/groceryList/generateGroceryList';
import * as repo from '../features/groceryList/groceryListRepo';
import { loadMealPlanEntries } from '../features/mealPlanner/mealPlannerRepo';
import dishesData from '../data/dish.json';

const CATEGORIES = ['Produce', 'Meat & Poultry', 'Pantry', 'Spices & Seasonings', 'Dairy'];

function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const ymd = d.toISOString().slice(0, 10);
        dates.push(ymd);
    }
    return dates;
}

function isNumericOnly(str) {
    return /^-?\d+(\.\d+)?$/.test(str.trim());
}

function validateQuantity(qty) {
    if (isNumericOnly(qty) && parseFloat(qty) < 0) {
        return 'Quantity cannot be negative.';
    }
    return '';
}

function LoadingSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-4 h-4 bg-gray-200 rounded" />
                    <div className="flex-1 h-4 bg-gray-200 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
}

function GroceryList() {
    const [groceryItems, setGroceryItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Produce' });
    const [quantityError, setQuantityError] = useState('');

    // Inline edit state
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({ name: '', quantity: '' });
    const [editError, setEditError] = useState('');

    // 2-step delete confirmation: Set of item ids pending confirmation
    const [confirmingDelete, setConfirmingDelete] = useState(new Set());

    // Auto-suggest banner
    const [suggestInfo, setSuggestInfo] = useState(null); // { count, entries }
    const [bannerDismissed, setBannerDismissed] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function init() {
            const items = await repo.loadItems();
            if (!cancelled) {
                setGroceryItems(items);
                setLoading(false);
                checkSuggestions(items);
            }
        }

        init();
        return () => { cancelled = true; };
    }, []);

    function checkSuggestions(currentItems) {
        const allEntries = loadMealPlanEntries();
        const weekDates = new Set(getCurrentWeekDates());
        const weekEntries = allEntries.filter(e => weekDates.has(e.date));

        if (weekEntries.length === 0) return;

        const dishNames = getWeekDishNames(weekEntries, dishesData);
        if (dishNames.length === 0) return;

        // Check if any ingredient from week dishes is missing from the list
        const existingNames = new Set(currentItems.map(i => i.name.toLowerCase()));
        const generated = generateFromMealPlan(weekEntries, dishesData);
        const unmatched = generated.filter(i => !existingNames.has(i.name.toLowerCase()));

        if (unmatched.length > 0) {
            setSuggestInfo({ count: dishNames.length, entries: weekEntries });
        }
    }

    async function handleGenerateFromMealPlan() {
        if (!suggestInfo) return;
        setGenerating(true);

        try {
            const generated = generateFromMealPlan(suggestInfo.entries, dishesData);
            const existingNames = new Set(groceryItems.map(i => i.name.toLowerCase()));

            const toAdd = generated.filter(i => !existingNames.has(i.name.toLowerCase()));

            const added = await Promise.all(toAdd.map(item => repo.addItem(item)));
            setGroceryItems(prev => [...prev, ...added]);
            setBannerDismissed(true);
        } catch (err) {
            console.error('Failed to generate grocery list:', err);
        } finally {
            setGenerating(false);
        }
    }

    const toggleCheck = async (id) => {
        const item = groceryItems.find(i => i.id === id);
        if (!item) return;

        const updated = { ...item, checked: !item.checked };
        setGroceryItems(items => items.map(i => i.id === id ? updated : i));

        try {
            await repo.updateItem(id, { checked: updated.checked });
        } catch (err) {
            console.error('Failed to update item:', err);
            // revert
            setGroceryItems(items => items.map(i => i.id === id ? item : i));
        }
    };

    const handleDeleteClick = (id) => {
        if (confirmingDelete.has(id)) {
            // Second click — confirm deletion
            handleConfirmDelete(id);
        } else {
            // First click — enter confirm state
            setConfirmingDelete(prev => new Set(prev).add(id));
            // Auto-reset after 3s if user doesn't confirm
            setTimeout(() => {
                setConfirmingDelete(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            }, 3000);
        }
    };

    const handleConfirmDelete = async (id) => {
        setGroceryItems(items => items.filter(i => i.id !== id));
        setConfirmingDelete(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });

        try {
            await repo.removeItem(id);
        } catch (err) {
            console.error('Failed to remove item:', err);
        }
    };

    const clearChecked = async () => {
        const toRemove = groceryItems.filter(i => i.checked);
        setGroceryItems(items => items.filter(i => !i.checked));

        try {
            await Promise.all(toRemove.map(i => repo.removeItem(i.id)));
        } catch (err) {
            console.error('Failed to clear checked items:', err);
        }
    };

    const clearAll = async () => {
        if (!window.confirm('Are you sure you want to clear your entire grocery list?')) return;

        setGroceryItems([]);
        try {
            await repo.clearAll();
        } catch (err) {
            console.error('Failed to clear all items:', err);
        }
    };

    const checkAllInCategory = async (category) => {
        const toUpdate = groceryItems.filter(i => i.category === category && !i.checked);
        setGroceryItems(items =>
            items.map(item => item.category === category ? { ...item, checked: true } : item)
        );

        try {
            await Promise.all(toUpdate.map(i => repo.updateItem(i.id, { checked: true })));
        } catch (err) {
            console.error('Failed to check all in category:', err);
        }
    };

    const handleQuantityChange = (value) => {
        setNewItem(prev => ({ ...prev, quantity: value }));
        setQuantityError(validateQuantity(value));
    };

    const addNewGroceryItem = async () => {
        if (!newItem.name.trim() || !newItem.quantity.trim()) return;
        const err = validateQuantity(newItem.quantity);
        if (err) {
            setQuantityError(err);
            return;
        }

        try {
            const created = await repo.addItem({
                name: newItem.name.trim(),
                quantity: newItem.quantity.trim(),
                category: newItem.category,
                source: 'Manual',
                checked: false,
            });
            setGroceryItems(prev => [...prev, created]);
            setNewItem({ name: '', quantity: '', category: 'Produce' });
            setShowAddForm(false);
            setQuantityError('');
        } catch (err) {
            console.error('Failed to add item:', err);
        }
    };

    const startEdit = (item) => {
        setEditingId(item.id);
        setEditValues({ name: item.name, quantity: item.quantity });
        setEditError('');
        // Cancel any pending delete confirmation for this item
        setConfirmingDelete(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
        });
    };

    const commitEdit = async (id) => {
        if (!editValues.name.trim()) {
            setEditError('Name cannot be empty.');
            return;
        }
        const err = validateQuantity(editValues.quantity);
        if (err) {
            setEditError(err);
            return;
        }

        const changes = { name: editValues.name.trim(), quantity: editValues.quantity.trim() };
        setGroceryItems(items => items.map(i => i.id === id ? { ...i, ...changes } : i));
        setEditingId(null);
        setEditError('');

        try {
            await repo.updateItem(id, changes);
        } catch (err) {
            console.error('Failed to update item:', err);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError('');
    };

    const filteredItems = groceryItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getItemsByCategory = (category) =>
        filteredItems.filter(item => item.category === category);

    const totalItems = groceryItems.length;
    const checkedItems = groceryItems.filter(item => item.checked).length;
    const progressPercent = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    const showBanner = suggestInfo && !bannerDismissed;

    return (
        <div className="min-h-screen bg-[#E8E3D8]">
            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* Auto-suggest Banner */}
                {showBanner && (
                    <div className="bg-[#6B8E6F] text-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between gap-4">
                        <p className="text-sm">
                            You have <strong>{suggestInfo.count} recipe{suggestInfo.count !== 1 ? 's' : ''}</strong> in your meal plan this week. Generate your grocery list?
                        </p>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={handleGenerateFromMealPlan}
                                disabled={generating}
                                className="px-3 py-1.5 bg-white text-[#6B8E6F] rounded-md text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-60"
                            >
                                {generating ? 'Generating...' : 'Generate'}
                            </button>
                            <button
                                onClick={() => setBannerDismissed(true)}
                                className="px-3 py-1.5 border border-white text-white rounded-md text-sm hover:bg-[#5a7a5e] transition-colors"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

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
                                onClick={() => alert('Share functionality coming soon!')}
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
                    {loading ? (
                        <LoadingSkeleton />
                    ) : totalItems === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-5xl mb-4">🛒</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your grocery list is empty</h3>
                            <p className="text-gray-500 mb-6">Add ingredients from recipes or manually add items below</p>
                        </div>
                    ) : (
                        <>
                            {CATEGORIES.map(category => {
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
                                                    className="py-2 group hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
                                                >
                                                    {editingId === item.id ? (
                                                        /* Inline Edit Mode */
                                                        <div className="space-y-2">
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={editValues.name}
                                                                    onChange={(e) => setEditValues(v => ({ ...v, name: e.target.value }))}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') commitEdit(item.id);
                                                                        if (e.key === 'Escape') cancelEdit();
                                                                    }}
                                                                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                                                    autoFocus
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={editValues.quantity}
                                                                    onChange={(e) => setEditValues(v => ({ ...v, quantity: e.target.value }))}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') commitEdit(item.id);
                                                                        if (e.key === 'Escape') cancelEdit();
                                                                    }}
                                                                    placeholder="Qty"
                                                                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                                                />
                                                                <button
                                                                    onClick={() => commitEdit(item.id)}
                                                                    className="px-2 py-1 text-xs bg-[#6B8E6F] text-white rounded hover:bg-[#5a7a5e]"
                                                                >
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={cancelEdit}
                                                                    className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                            {editError && (
                                                                <p className="text-xs text-red-500">{editError}</p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        /* Normal View Mode */
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={item.checked}
                                                                    onChange={() => toggleCheck(item.id)}
                                                                    className="w-4 h-4 text-[#6B8E6F] border-gray-300 rounded focus:ring-[#6B8E6F] cursor-pointer shrink-0"
                                                                />
                                                                <div className={item.checked ? 'opacity-50 min-w-0' : 'min-w-0'}>
                                                                    <div className={`text-sm font-medium truncate ${item.checked ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                                        {item.name}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 truncate">{item.source}</div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 shrink-0 ml-2">
                                                                <span className="text-sm text-gray-600">{item.quantity}</span>

                                                                {/* Edit button */}
                                                                <button
                                                                    onClick={() => startEdit(item)}
                                                                    className="text-gray-400 hover:text-[#6B8E6F] transition-colors opacity-0 group-hover:opacity-100"
                                                                    title="Edit"
                                                                >
                                                                    ✎
                                                                </button>

                                                                {/* Delete button — 2-step */}
                                                                {confirmingDelete.has(item.id) ? (
                                                                    <button
                                                                        onClick={() => handleDeleteClick(item.id)}
                                                                        className="text-xs px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                                                    >
                                                                        Confirm?
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleDeleteClick(item.id)}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                                        title="Delete"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* Add New Item Section */}
                    {!loading && (
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
                                            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                        />
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Quantity"
                                                value={newItem.quantity}
                                                onChange={(e) => handleQuantityChange(e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F] ${quantityError ? 'border-red-400' : 'border-gray-300'}`}
                                            />
                                            {quantityError && (
                                                <p className="text-xs text-red-500 mt-1">{quantityError}</p>
                                            )}
                                        </div>
                                    </div>
                                    <select
                                        value={newItem.category}
                                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6B8E6F]"
                                    >
                                        {CATEGORIES.map(cat => (
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
                                                setQuantityError('');
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
