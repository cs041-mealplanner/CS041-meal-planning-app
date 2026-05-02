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

    const defaultCategories = ['Produce', 'Meat & Poultry', 'Pantry', 'Spices & Seasonings', 'Dairy'];

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
        if (!window.confirm('Are you sure you want to delete checked items?')) {
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
        <div className="min-h-screen bg-mainbg">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="mb-6 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primaryDark sm:text-4xl lg:text-5xl">
                                My Grocery List
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
                                Track your ingredients, check off items, and keep your weekly shopping organized.
                            </p>
                        </div>

                        {checkedItems > 0 && (
                            <button
                                onClick={clearChecked}
                                className="inline-flex w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 sm:w-auto"
                            >
                                Clear Checked ({checkedItems})
                            </button>
                        )}
                    </div>

                    <div className="mt-6 rounded-2xl bg-subtle p-4 sm:p-5">
                        <div className="mb-3 flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-primaryDark">
                                Shopping Progress
                            </span>

                            <span className="rounded-full bg-card px-3 py-1 text-sm font-bold text-primaryDark">
                                {checkedItems}/{totalItems}
                            </span>
                        </div>

                        <div className="h-3 w-full overflow-hidden rounded-full bg-card">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </section>

                <section className="mb-6 rounded-3xl bg-card p-4 shadow-sm sm:p-5">
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search grocery items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-base text-primaryDark shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </section>

                <section className="rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    {isLoading ? (
                        <div className="py-16 text-center text-muted">
                            Loading your grocery list...
                        </div>
                    ) : totalItems === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mb-4 text-6xl">🛒</div>

                            <h3 className="mb-2 text-2xl font-bold text-primaryDark">
                                Your grocery list is empty
                            </h3>

                            <p className="mx-auto max-w-md text-muted">
                                Add ingredients from recipes or manually add items below.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categories.map((category) => {
                                const categoryItems = getItemsByCategory(category);
                                if (categoryItems.length === 0) return null;

                                return (
                                    <div key={category}>
                                        <div className="mb-3 flex flex-col gap-3 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-lg font-bold text-primaryDark">
                                                    {category}
                                                </h2>

                                                <span className="rounded-full bg-subtle px-3 py-1 text-xs font-semibold text-muted">
                                                    {categoryItems.length} items
                                                </span>
                                            </div>

                                            <button
                                                onClick={() => checkAllInCategory(category)}
                                                className="w-fit rounded-full px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-subtle"
                                            >
                                                Check all
                                            </button>
                                        </div>

                                        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100">
                                            {categoryItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="group flex items-start justify-between gap-4 bg-card px-4 py-4 transition-colors hover:bg-subtle sm:px-5"
                                                >
                                                    <div className="flex min-w-0 flex-1 items-start gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.checked}
                                                            onChange={() => toggleCheck(item.id)}
                                                            className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                                                        />

                                                        <div className={`min-w-0 ${item.checked ? 'opacity-50' : ''}`}>
                                                            <div
                                                                className={`break-words text-base font-semibold ${item.checked
                                                                        ? 'text-muted line-through'
                                                                        : 'text-primaryDark'
                                                                    }`}
                                                            >
                                                                {item.name}
                                                            </div>

                                                            <div className="mt-1 break-words text-xs text-muted">
                                                                {item.source}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex shrink-0 items-center gap-3">
                                                        <span className="max-w-28 break-words text-right text-sm font-semibold text-muted sm:max-w-none">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="rounded-full px-2 py-1 text-muted opacity-100 transition-colors hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
                                                            aria-label={`Remove ${item.name}`}
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
                        </div>
                    )}

                    <div className="mt-8 border-t border-gray-100 pt-6">
                        {!showAddForm ? (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="w-full rounded-2xl border-2 border-dashed border-gray-300 py-4 font-semibold text-muted transition-colors hover:border-primary hover:bg-subtle hover:text-primary"
                            >
                                + Add New Item
                            </button>
                        ) : (
                            <div className="rounded-2xl bg-subtle p-4 sm:p-5">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <input
                                        type="text"
                                        placeholder="Item name"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Quantity"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <select
                                    value={newItem.category}
                                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {defaultCategories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                    <button
                                        onClick={addNewGroceryItem}
                                        className="flex-1 rounded-2xl bg-primary px-5 py-3 font-bold text-white transition-colors hover:bg-primaryDark"
                                    >
                                        Add Item
                                    </button>

                                    <button
                                        onClick={() => {
                                            setShowAddForm(false);
                                            setNewItem({ name: '', quantity: '', category: 'Produce' });
                                        }}
                                        className="flex-1 rounded-2xl border-2 border-primary bg-card px-5 py-3 font-bold text-primary transition-colors hover:bg-subtle"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default GroceryList;