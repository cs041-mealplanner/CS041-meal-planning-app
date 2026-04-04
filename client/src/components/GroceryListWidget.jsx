// Grocery section for Dashboard

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GroceryListWidget() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    // load grocery items from localStorage
    useEffect(() => {
        const loadItems = () => {
            const saved = localStorage.getItem('groceryList');
            if (saved) {
                return JSON.parse(saved);
            }
            return [];
        };

        setItems(loadItems());
    }, []);


    const toggleCheck = (id) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );

        setItems(updatedItems);
        localStorage.setItem('groceryList', JSON.stringify(updatedItems));
    };


    const checkedCount = items.filter(item => item.checked).length;
    const totalCount = items.length;
    const progressPercent = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;


    // show max 10 items
    const displayItems = items.slice(0, 10);

    return (
        <div className="bg-card rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-primaryDark">Grocery List</h2>

                <button
                    onClick={() => navigate('/grocery')}
                    className="text-primary hover:text-primaryDark font-medium text-sm"
                >
                    View Full List →
                </button>

            </div>


            {/* Progress Bar */}
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


            {/* Empty State */}
            {totalCount === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted mb-4">Your grocery list is empty.</p>

                    <button
                        onClick={() => navigate('/grocery')}
                        className="text-primary hover:text-primaryDark font-medium"
                    >
                        Add items →
                    </button>
                </div>
            )}


            {/* Items List */}
            {totalCount > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {displayItems.map(item => (
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
                                className={`flex-1 ${item.checked ? 'line-through text-muted' : 'text-primaryDark'
                                    }`}
                            >

                                {item.name}
                            </span>
                        </div>
                    ))}

                    {items.length > 10 && (
                        <p className="text-center text-sm text-muted pt-2">
                            + {items.length - 10} more items
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
