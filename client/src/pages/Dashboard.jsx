import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCalendar from '../components/DashboardCalendar';
import GroceryListWidget from '../components/GroceryListWidget';
import MealCard from '../components/MealCard';
import { loadMealPlanEntries } from '../features/mealPlanner/mealPlannerRepo';
import { listRecipes, normalizeRecipesForPlanner } from '../features/recipes/recipeStorage';

export default function Dashboard() {
    const navigate = useNavigate();
    const today = dayjs().format('YYYY-MM-DD');

    const [allRecipes, setAllRecipes] = useState([]);
    const [mealPlanEntries, setMealPlanEntries] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadDashboardData() {
            try {
                const [recipes, entries] = await Promise.all([
                    listRecipes(),
                    loadMealPlanEntries(),
                ]);

                if (!isMounted) return;

                setAllRecipes(normalizeRecipesForPlanner(recipes));
                setMealPlanEntries(entries);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                if (isMounted) {
                    setIsLoadingData(false);
                }
            }
        }

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const todayMeals = useMemo(() => {
        const todayEntries = mealPlanEntries.filter((entry) => entry.date === today);
        const slotOrder = { breakfast: 0, lunch: 1, dinner: 2 };

        return todayEntries
            .sort((a, b) => (slotOrder[a.slot] ?? 99) - (slotOrder[b.slot] ?? 99))
            .map((entry) => allRecipes.find((dish) => dish.id === entry.dishId))
            .filter(Boolean);
    }, [allRecipes, mealPlanEntries, today]);

    return (
        <div className="min-h-screen bg-mainbg">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="mb-8 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex rounded-full bg-subtle px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                                Today’s overview
                            </div>

                            <h1 className="text-3xl font-bold leading-tight text-primaryDark sm:text-4xl lg:text-5xl">
                                Welcome Back!
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base lg:text-lg">
                                New day, new meals — check today’s plan, review your week, and keep your grocery list moving.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
                            <button
                                type="button"
                                onClick={() => navigate('/meal-planner')}
                                className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primaryDark sm:text-base"
                            >
                                Plan Meals
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/recipes')}
                                className="rounded-2xl border-2 border-primary bg-card px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-subtle sm:text-base"
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-primaryDark sm:text-3xl">
                                Meals for Today
                            </h2>
                            <p className="mt-1 text-sm text-muted">
                                Breakfast, lunch, and dinner appear here after you save your plan.
                            </p>
                        </div>
                    </div>

                    {isLoadingData ? (
                        <div className="rounded-3xl bg-card p-8 text-center text-muted shadow-sm sm:p-12">
                            Loading today&apos;s meals...
                        </div>
                    ) : todayMeals.length === 0 ? (
                        <div className="rounded-3xl bg-card p-8 text-center shadow-sm sm:p-12">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-subtle text-3xl">
                                🗓️
                            </div>

                            <h3 className="mb-2 text-xl font-bold text-primaryDark sm:text-2xl">
                                No meals planned for today
                            </h3>

                            <p className="mx-auto mb-6 max-w-md text-sm text-muted sm:text-base">
                                Start planning your meals to see today&apos;s lineup here.
                            </p>

                            <button
                                onClick={() => navigate('/meal-planner')}
                                className="w-full rounded-2xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primaryDark sm:w-auto"
                            >
                                Start Planning
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {todayMeals.map((dish, idx) => (
                                <MealCard key={`${dish.id}-${idx}`} dish={dish} />
                            ))}
                        </div>
                    )}
                </section>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                    <section>
                        <DashboardCalendar allRecipes={allRecipes} mealPlanEntries={mealPlanEntries} />
                    </section>

                    <section>
                        <GroceryListWidget />
                    </section>
                </div>
            </div>
        </div>
    );
}
