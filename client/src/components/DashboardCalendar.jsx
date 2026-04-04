// calendar section for Dashboard

import dayjs from 'dayjs';
import { useMemo } from 'react';
import dishes from '../data/dish.json';
import { loadMealPlanEntries } from '../features/mealPlanner/mealPlannerRepo';


export default function DashboardCalendar() {
    // Get current week (Sun-Sat)
    const currentWeekStart = dayjs().startOf('week');
    const days = useMemo(() =>
        [...Array(7)].map((_, i) => currentWeekStart.add(i, 'day')),
        [currentWeekStart]
    );


    const today = dayjs().format('YYYY-MM-DD');

    // Load all meal plan entries
    const mealPlanEntries = useMemo(() => loadMealPlanEntries(), []);

    // Get meals for a specific day
    const getMealsForDay = (date) => {
        const dayEntries = mealPlanEntries.filter(
            entry => entry.date === date.format('YYYY-MM-DD')
        );

        // Sort by slot order (breakfast, lunch, dinner)
        const slotOrder = { breakfast: 0, lunch: 1, dinner: 2 };
        dayEntries.sort((a, b) => slotOrder[a.slot] - slotOrder[b.slot]);

        // Map to dish names
        return dayEntries.map(entry => {
            const dish = dishes.find(d => d.id === entry.dishId);
            return dish ? dish.name : 'Unknown';
        });
    };

    // Display logic: show all meals the user planned
    const getDisplayMeals = (meals) => {
        return meals; // show everything they planned
    };


    return (
        <div className="bg-card rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold text-primaryDark mb-6">This Week</h2>

            <div className="grid grid-cols-7 gap-3">
                {days.map((day) => {
                    const meals = getMealsForDay(day);
                    const displayMeals = getDisplayMeals(meals);
                    const isToday = day.format('YYYY-MM-DD') === today;
                    const isPast = day.isBefore(dayjs(), 'day');

                    return (
                        <div
                            key={day.format('YYYY-MM-DD')}
                            className={`p-3 rounded-lg border-2 transition-all ${isToday
                                ? 'bg-primary/10 border-primary'
                                : 'bg-subtle border-transparent'
                                } ${isPast ? 'opacity-60' : ''}`}
                        >

                            {/* Day label */}
                            <div className="text-center mb-2">
                                <div className="text-xs font-medium text-muted">
                                    {day.format('ddd')}
                                </div>

                                <div className={`text-lg font-bold ${isToday ? 'text-primary' : 'text-primaryDark'
                                    }`}>
                                    {day.format('D')}
                                </div>
                            </div>


                            {/* Meals */}
                            <div className="space-y-1">
                                {displayMeals.length === 0 ? (
                                    <div className="text-xs text-center text-muted italic py-2">
                                        No meals
                                    </div>

                                ) : (
                                    displayMeals.map((meal, idx) => (
                                        <div
                                            key={idx}
                                            className="text-xs bg-card rounded px-2 py-1 text-primaryDark truncate"
                                            title={meal}
                                        >
                                            {meal}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
