// Grocery section for Dashboard

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroceryItems, saveGroceryItems } from '../features/grocery/groceryStorage';

const DEFAULT_VISIBLE_ITEMS = 10;

const sortGroceryItems = (items) => {
    return [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
};

export default function GroceryListWidget() {
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(DEFAULT_VISIBLE_ITEMS);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadItems = async () => {
            try {
                const loadedItems = await getGroceryItems();

                if (isMounted) {
                    setItems(sortGroceryItems(loadedItems));
                }
            } catch (error) {
                console.error('Failed to load grocery items:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadItems();

        const handleFocus = () => {
            loadItems();
        };
        window.addEventListener('focus', handleFocus);

        return () => {
            isMounted = false;
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    const persistItems = async (nextItems) => {
        const previousItems = items;
        setItems(nextItems);

        try {
            await saveGroceryItems(nextItems, previousItems);
        } catch (error) {
            console.error('Failed to save grocery widget items:', error);
            setItems(previousItems);
            alert(error.message || 'We could not update your grocery list right now.');
        }
    };

    const toggleCheck = async (id) => {
        const updatedItems = sortGroceryItems(items.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));

        await persistItems(updatedItems);
    };

    const clearCheckedItems = async () => {
        if (!window.confirm('Are you sure? (Deleting checked items)')) {
            return;
        }

        const updatedItems = items.filter((item) => !item.checked);
        await persistItems(updatedItems);
        setVisibleCount(DEFAULT_VISIBLE_ITEMS);
    };

    const showMoreItems = () => {
        setVisibleCount((count) => count + DEFAULT_VISIBLE_ITEMS);
    };

    const showFewerItems = () => {
        setVisibleCount(DEFAULT_VISIBLE_ITEMS);
    };

    const checkedCount = items.filter((item) => item.checked).length;
    const totalCount = items.length;
    const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
    const displayItems = items.slice(0, visibleCount);
    const remainingItems = totalCount - displayItems.length;
    const nextLoadCount = Math.min(DEFAULT_VISIBLE_ITEMS, remainingItems);
    const canShowFewer = visibleCount > DEFAULT_VISIBLE_ITEMS && totalCount > DEFAULT_VISIBLE_ITEMS;

    return (
        <div className="bg-card rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-primaryDark">Grocery List</h2>

                <div className="flex items-center gap-3">
                    {checkedCount > 0 && (
                        <button
                            type="button"
                            onClick={clearCheckedItems}
                            className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                        >
                            Clear Checked ({checkedCount})
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => navigate('/grocery')}
                        className="text-primary hover:text-primaryDark font-medium text-sm"
                    >
                        View Full List
                    </button>
                </div>
            </div>

            {totalCount > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between text-sm text-muted mb-2">
                        <span>{checkedCount} / {totalCount} items checked</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>

                    <div className="w-full bg-subtle rounded-full h-3">
                        <div
                            className="bg-primary rounded-full h-3 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-8">
                    <p className="text-muted">Loading your grocery list...</p>
                </div>
            ) : totalCount === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted mb-4">Your grocery list is empty.</p>

                    <button
                        type="button"
                        onClick={() => navigate('/grocery')}
                        className="text-primary hover:text-primaryDark font-medium"
                    >
                        Add items
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 py-2 hover:bg-subtle px-2 rounded-lg transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleCheck(item.id)}
                                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary cursor-pointer"
                            />

                            <span
                                className={`flex-1 ${item.checked ? 'line-through text-muted' : 'text-primaryDark'}`}
                            >
                                {item.name}
                            </span>
                        </div>
                    ))}

                    {remainingItems > 0 && (
                        <button
                            type="button"
                            onClick={showMoreItems}
                            className="w-full rounded-lg border border-dashed border-primary/40 bg-subtle px-4 py-3 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
                        >
                            Show {nextLoadCount} more item{nextLoadCount === 1 ? '' : 's'} (+{remainingItems} remaining)
                        </button>
                    )}

                    {canShowFewer && (
                        <button
                            type="button"
                            onClick={showFewerItems}
                            className="w-full text-sm font-medium text-muted transition-colors hover:text-primaryDark"
                        >
                            Show fewer
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
