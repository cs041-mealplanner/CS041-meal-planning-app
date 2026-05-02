import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddRecipe from '../components/AddRecipe';
import { addGroceryItems } from '../features/grocery/groceryStorage';
import { getRecipeById, isPersistedRecipeId, saveSpoonacularRecipe, updateRecipe } from '../features/recipes/recipeStorage';

const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';

const NUTRIENT_CONFIG = [
    { name: 'Calories', label: 'Calories', unit: '', icon: '🔥' },
    { name: 'Protein', label: 'Protein', unit: 'g', icon: '💪' },
    { name: 'Carbohydrates', label: 'Carbs', unit: 'g', icon: '🌾' },
    { name: 'Fat', label: 'Fat', unit: 'g', icon: '🥑' },
    { name: 'Fiber', label: 'Fiber', unit: 'g', icon: '🌿' },
    { name: 'Sodium', label: 'Sodium', unit: 'mg', icon: '🧂' },
];

function getNutritionAmount(recipe, nutrientName) {
    if (!recipe?.nutrition?.nutrients) return null;
    const nutrient = recipe.nutrition.nutrients.find((item) => item.name === nutrientName);

    if (!nutrient || nutrient.amount == null || Number.isNaN(Number(nutrient.amount))) {
        return null;
    }

    return Math.round(Number(nutrient.amount));
}

function getRecipeTags(recipe) {
    const tags = new Set(Array.isArray(recipe?.tags) ? recipe.tags : []);
    const proteinAmount = getNutritionAmount(recipe, 'Protein');
    const carbsAmount = getNutritionAmount(recipe, 'Carbohydrates');

    if (recipe?.vegetarian) tags.add('Vegetarian');
    if (recipe?.vegan) tags.add('Vegan');
    if (proteinAmount != null && proteinAmount >= 25) tags.add('High Protein');
    if (carbsAmount != null && carbsAmount <= 30) tags.add('Low Carb');

    return [...tags];
}

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            if (isPersistedRecipeId(id)) {
                try {
                    const persistedRecipe = await getRecipeById(id);

                    if (persistedRecipe) {
                        setRecipe(persistedRecipe);
                    } else {
                        setError('Recipe not found');
                    }
                    setLoading(false);
                } catch (err) {
                    console.error('Error loading manual recipe:', err);
                    setError('Failed to load recipe');
                    setLoading(false);
                }
                return;
            }

            if (!API_KEY) {
                console.error('Spoonacular API key not configured.');
                setError('Unable to load recipe details.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${API_BASE}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch recipe details');
                }

                const data = await response.json();
                setRecipe(data);
            } catch (err) {
                console.error('Recipe fetch error:', err);
                setError('Failed to load recipe. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetail();
    }, [id]);

    const addToGroceryList = async () => {
        if (!recipe) return;

        const newItems = recipe.extendedIngredients.map((ingredient) => ({
            name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.unit}`,
            category: ingredient.aisle || 'Pantry',
            source: `${recipe.title} recipe`,
            checked: false
        }));

        try {
            await addGroceryItems(newItems);
            alert(`Added all ${recipe.extendedIngredients.length} ingredients to your grocery list!`);
            navigate('/grocery');
        } catch (error) {
            console.error('Failed to add ingredients to grocery list:', error);
            alert(error.message || 'Unable to add these ingredients right now.');
        }
    };

    const addToMealPlan = async () => {
        if (!recipe) return;

        if (isPersistedRecipeId(recipe.id)) {
            navigate('/meal-planner');
            return;
        }

        try {
            const { created } = await saveSpoonacularRecipe(recipe);

            if (created) {
                alert(`Added "${recipe.title}" to your recipes and meal planner!`);
            } else {
                alert('This recipe is already available in your meal planner.');
            }

            navigate('/meal-planner');
        } catch (error) {
            console.error('Failed to save recipe for meal planner:', error);
            alert(error.message || 'Unable to save this recipe right now.');
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/recipes');
        }
    };

    const recipeTags = getRecipeTags(recipe);
    const nutritionEntries = NUTRIENT_CONFIG
        .map(({ name, label, unit, icon }) => {
            const value = getNutritionAmount(recipe, name);

            if (value == null) return null;

            return {
                label,
                value,
                unit,
                icon,
            };
        })
        .filter(Boolean);

    const isManualRecipe = typeof recipe?.id === 'string' && recipe.id.startsWith('manual-');

    const handleSaveManualRecipe = async (updatedRecipe) => {
        const savedRecipe = await updateRecipe(updatedRecipe);
        setRecipe(savedRecipe);
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-mainbg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-mainbg flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primaryDark mb-4">
                        {error || 'Recipe not found'}
                    </h2>

                    <button
                        onClick={() => navigate('/recipes')}
                        className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primaryDark transition-colors"
                    >
                        Back to Recipes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-mainbg">
            {isManualRecipe && isEditModalOpen && (
                <AddRecipe
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveManualRecipe}
                    existingRecipe={recipe}
                    modalTitle="Edit Recipe"
                    submitLabel="Save Changes"
                />
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <button
                    onClick={handleBack}
                    className="mb-5 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-primaryDark shadow-sm hover:bg-subtle hover:text-primary transition-colors font-semibold"
                >
                    <span className="text-xl leading-none">←</span>
                    <span>Recipes</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
                    <div className="bg-card rounded-3xl shadow-md overflow-hidden min-h-[260px] sm:min-h-[360px]">
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full min-h-[260px] sm:min-h-[360px] object-cover"
                            onError={(e) => {
                                e.target.src = '/assets/images/placeholder-recipe.png';
                            }}
                        />
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primaryDark leading-tight">
                                {recipe.title}
                            </h1>

                            {isManualRecipe && (
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition hover:bg-primaryDark"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z" />
                                    </svg>
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3 rounded-3xl bg-subtle p-4 sm:p-5">
                            <div className="text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-2xl mb-1">👥</div>
                                <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wide mb-1">
                                    Servings
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-primaryDark">
                                    {recipe.servings}
                                </div>
                            </div>

                            <div className="text-center border-r border-gray-200 last:border-r-0">
                                <div className="text-2xl mb-1">⏱️</div>
                                <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wide mb-1">
                                    Prep
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-primaryDark">
                                    {recipe.preparationMinutes || 0}
                                    <span className="text-sm font-medium text-muted ml-1">min</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <div className="text-2xl mb-1">🍳</div>
                                <div className="text-[10px] sm:text-xs text-muted uppercase tracking-wide mb-1">
                                    Cook
                                </div>
                                <div className="text-2xl sm:text-3xl font-bold text-primaryDark">
                                    {recipe.cookingMinutes || 0}
                                    <span className="text-sm font-medium text-muted ml-1">min</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-3xl shadow-md p-5 sm:p-6">
                            {nutritionEntries.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="text-lg sm:text-xl font-bold text-primaryDark">
                                            Nutrition Info
                                        </h3>
                                        <span className="text-xs text-muted bg-subtle rounded-full px-3 py-1">
                                            per serving
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {nutritionEntries.map((entry) => (
                                            <div
                                                key={entry.label}
                                                className="rounded-2xl bg-subtle p-4 text-center"
                                            >
                                                <div className="text-2xl mb-2">{entry.icon}</div>
                                                <div className="text-2xl font-bold text-primaryDark leading-none">
                                                    {entry.value}
                                                    <span className="text-base font-semibold">{entry.unit}</span>
                                                </div>
                                                <div className="mt-1 text-xs sm:text-sm text-muted font-normal">
                                                    {entry.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : recipeTags.length === 0 ? (
                                <div className="text-sm font-medium text-muted">No Nutrition Info.</div>
                            ) : null}

                            {recipeTags.length > 0 && (
                                <div className={nutritionEntries.length > 0 ? "mt-5 flex flex-wrap gap-2" : "flex flex-wrap gap-2"}>
                                    {recipeTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="rounded-full bg-subtle px-4 py-2 text-xs sm:text-sm font-semibold text-primaryDark"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={addToGroceryList}
                                className="w-full py-4 bg-primary text-white rounded-2xl hover:bg-primaryDark transition-colors font-bold shadow-md text-lg flex items-center justify-center gap-2"
                            >
                                <span>🛒</span>
                                Add to Grocery List
                            </button>

                            <button
                                onClick={addToMealPlan}
                                className="w-full py-4 bg-card text-primary border-2 border-primary rounded-2xl hover:bg-subtle transition-colors font-bold text-lg flex items-center justify-center gap-2"
                            >
                                <span>🗓️</span>
                                Add to Meal Plan
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-3xl shadow-md p-5 sm:p-8">
                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-primaryDark">
                                Ingredients
                            </h2>
                            <p className="mt-2 text-sm sm:text-base text-muted">
                                Add everything to your grocery list in one tap.
                            </p>
                        </div>

                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-subtle text-2xl">
                            🧺
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 overflow-hidden">
                        {recipe.extendedIngredients.map((ingredient, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4 bg-card border-b border-gray-100 last:border-b-0 hover:bg-subtle transition-colors"
                            >
                                <div className="min-w-0">
                                    <div className="font-semibold text-primaryDark truncate">
                                        {ingredient.name}
                                    </div>
                                </div>

                                <div className="shrink-0 text-sm sm:text-base text-muted font-medium text-right">
                                    {ingredient.amount} {ingredient.unit}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}