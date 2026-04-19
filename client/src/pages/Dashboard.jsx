import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardCalendar from '../components/DashboardCalendar';
import GroceryListWidget from '../components/GroceryListWidget';
import MealCard from '../components/MealCard';
import { loadMealPlanEntries } from '../features/mealPlanner/mealPlannerRepo';


export default function Dashboard() {
    const navigate = useNavigate();
    const today = dayjs().format('YYYY-MM-DD');


    // Load recipes from localStorage
    const [allRecipes, setAllRecipes] = useState([]);


    useEffect(() => {
        const loadRecipes = () => {
            const poolRecipes = JSON.parse(localStorage.getItem('recipePool') || '[]');
            const manualRecipes = JSON.parse(localStorage.getItem('manualRecipes') || '[]');
            setAllRecipes([...poolRecipes, ...manualRecipes]);
        };
        loadRecipes();
    }, []);


    // Load today's meals
    const todayMeals = useMemo(() => {
        const allEntries = loadMealPlanEntries();
        const todayEntries = allEntries.filter(entry => entry.date === today);


        // Sort by slot (breakfast, lunch, dinner)
        const slotOrder = { breakfast: 0, lunch: 1, dinner: 2 };
        todayEntries.sort((a, b) => slotOrder[a.slot] - slotOrder[b.slot]);


        // Map to dish objects
        return todayEntries
            .map(entry => allRecipes.find(d => d.id === entry.dishId))
            .filter(Boolean);   // Remove any null/undefined
    }, [today, allRecipes]);


    return (
        <div className="min-h-screen bg-mainbg">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">


                {/* Welcome Section */}
                <div>
                    <h1 className="text-4xl font-bold text-primaryDark mb-2">
                        Welcome Back!
                    </h1>

                    <p className="text-lg text-muted">
                        New day, new meals — nourish your body and mind.
                    </p>

                </div>


                {/* Meals for Today */}
                <section>
                    <h2 className="text-2xl font-semibold text-primaryDark mb-6">
                        Meals for Today
                    </h2>

                    {todayMeals.length === 0 ? (
                        // Empty State
                        <div className="bg-card rounded-xl shadow-md p-12 text-center">

                            <svg
                                className="mx-auto h-16 w-16 text-muted mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>

                            <h3 className="text-xl font-semibold text-primaryDark mb-2">
                                No meals planned for today
                            </h3>

                            <p className="text-muted mb-6">
                                Start planning your meals to see them here
                            </p>

                            <button
                                onClick={() => navigate('/meal-planner')}
                                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
                            >
                                Start Planning
                            </button>

                        </div>
                    ) : (

                        // Meal Cards
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {todayMeals.map((dish, idx) => (
                                <MealCard key={`${dish.id}-${idx}`} dish={dish} />
                            ))}
                        </div>
                    )}
                </section>


                {/* Weekly Calendar weekly */}
                <section>
                    <DashboardCalendar allRecipes={allRecipes} />
                </section>


                {/* Grocery List Widget */}
                <section>
                    <GroceryListWidget />
                </section>
            </div>
        </div>
    );
}
