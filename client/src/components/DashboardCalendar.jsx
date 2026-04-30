import dayjs from 'dayjs';
import { useMemo } from 'react';

export default function DashboardCalendar({ allRecipes = [], mealPlanEntries = [] }) {
    const currentWeekStart = dayjs().startOf('week');

    const days = useMemo(
        () => [...Array(7)].map((_, i) => currentWeekStart.add(i, 'day')),
        [currentWeekStart]
    );

    const today = dayjs().format('YYYY-MM-DD');

    const getMealsForDay = (date) => {
        const dayEntries = mealPlanEntries.filter(
            (entry) => entry.date === date.format('YYYY-MM-DD')
        );

        const slotOrder = { breakfast: 0, lunch: 1, dinner: 2 };

        dayEntries.sort(
            (a, b) => (slotOrder[a.slot] ?? 99) - (slotOrder[b.slot] ?? 99)
        );

        return dayEntries.map((entry) => {
            const dish = allRecipes.find((d) => d.id === entry.dishId);
            return dish ? dish.name || dish.title : 'Unknown';
        });
    };

    const getDisplayMeals = (meals) => {
        return meals.slice(0, 2);
    };

    return (
        <div className="bg-card rounded-2xl shadow-md p-5 sm:p-6">
            <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-primaryDark">
                    This Week
                </h2>

                <p className="mt-1 text-sm text-muted">
                    A quick look at your current meal plan.
                </p>
            </div>

            <div className="relative -mx-5 sm:mx-0">
                <div className="flex gap-3 overflow-x-auto px-5 pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-7 sm:overflow-visible sm:px-0 sm:snap-none">
                    {days.map((day) => {
                        const meals = getMealsForDay(day);
                        const displayMeals = getDisplayMeals(meals);
                        const isToday = day.format('YYYY-MM-DD') === today;
                        const isPast = day.isBefore(dayjs(), 'day');

                        return (
                            <div
                                key={day.format('YYYY-MM-DD')}
                                className={`
                                    basis-[31%] shrink-0 snap-start sm:basis-auto sm:min-w-0
                                    rounded-2xl border-2 px-3 py-4 text-center transition-all
                                    ${isToday
                                        ? 'border-primary bg-primary/10 shadow-sm'
                                        : 'border-transparent bg-subtle'
                                    }
                                    ${isPast ? 'opacity-60' : ''}
                                `}
                            >
                                <div className="mb-3">
                                    <div className="text-xs font-semibold text-muted">
                                        {day.format('ddd')}
                                    </div>

                                    <div
                                        className={`mt-1 text-2xl font-bold leading-none ${isToday ? 'text-primary' : 'text-primaryDark'
                                            }`}
                                    >
                                        {day.format('D')}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    {displayMeals.length === 0 ? (
                                        <div className="rounded-xl py-2 text-xs italic text-muted whitespace-nowrap">
                                            No meals
                                        </div>
                                    ) : (
                                        displayMeals.map((meal, idx) => (
                                            <div
                                                key={idx}
                                                className="truncate rounded-xl bg-card px-2 py-1.5 text-xs font-medium text-primaryDark shadow-sm"
                                                title={meal}
                                            >
                                                {meal}
                                            </div>
                                        ))
                                    )}

                                    {meals.length > 2 && (
                                        <div className="text-[11px] font-semibold text-primary">
                                            +{meals.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-card to-transparent sm:hidden" />
            </div>
        </div>
    );
}