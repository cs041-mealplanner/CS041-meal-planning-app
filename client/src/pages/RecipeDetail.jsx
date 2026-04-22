import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddRecipe from '../components/AddRecipe';


const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';
const NUTRIENT_CONFIG = [
    { name: 'Calories', label: 'Calories', unit: '' },
    { name: 'Protein', label: 'Protein', unit: 'g' },
    { name: 'Carbohydrates', label: 'Carbs', unit: 'g' },
    { name: 'Fat', label: 'Fat', unit: 'g' },
    { name: 'Fiber', label: 'Fiber', unit: 'g' },
    { name: 'Sodium', label: 'Sodium', unit: 'mg' },
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
            // Check if this is a manual recipe
            if (id.startsWith('manual-')) {
                try {
                    const manualRecipes = JSON.parse(localStorage.getItem('manualRecipes') || '[]');
                    const recipe = manualRecipes.find(r => r.id === id);

                    if (recipe) {
                        setRecipe(recipe);
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


            // other, fetch from Spoonacular API
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


    const addToGroceryList = () => {
        if (!recipe) return;

        // Get existing grocery list from localStorage
        const existingList = JSON.parse(localStorage.getItem('groceryList') || '[]');

        // Transform Spoonacular ingredients to grocery list format
        const newItems = recipe.extendedIngredients.map((ingredient, idx) => ({
            id: Date.now() + Math.random() + idx,
            name: ingredient.name,
            quantity: `${ingredient.amount} ${ingredient.unit}`,
            category: ingredient.aisle || 'Pantry',
            source: `${recipe.title} recipe`,
            checked: false
        }));


        const updatedList = [...existingList, ...newItems];
        localStorage.setItem('groceryList', JSON.stringify(updatedList));


        alert(`Added all ${recipe.extendedIngredients.length} ingredients to your grocery list!`);
        navigate('/grocery');
    };


    const addToMealPlan = () => {
        if (!recipe) return;


        // Transform Spoonacular recipe
        const poolRecipe = {
            id: `pool-${recipe.id}`,
            name: recipe.title,
            image: recipe.image,
            servings: recipe.servings,
            prep_time: recipe.preparationMinutes || 0,
            cook_time: recipe.cookingMinutes || 0,
            meal: 'any',          // Spoonacular doesn't categorize by meal type
            nutrition: {
                calories: getNutritionAmount(recipe, 'Calories') ?? 0,
                protein: getNutritionAmount(recipe, 'Protein') ?? 0,
                carbs: getNutritionAmount(recipe, 'Carbohydrates') ?? 0,
                fat: getNutritionAmount(recipe, 'Fat') ?? 0,
                fiber: getNutritionAmount(recipe, 'Fiber') ?? 0,
                sodium: getNutritionAmount(recipe, 'Sodium') ?? 0
            },
            ingredients: recipe.extendedIngredients.map(ing => ({
                item: ing.name,
                amount: `${ing.amount} ${ing.unit}`,
                category: ing.aisle || 'Pantry'
            }))
        };


        // Get existing pool from localStorage
        const existingPool = JSON.parse(localStorage.getItem('recipePool') || '[]');

        // Check if already in pool
        const alreadyExists = existingPool.some(r => r.id === poolRecipe.id);


        if (alreadyExists) {
            alert('This recipe is already in your meal plan pool!');
            navigate('/meal-planner');
            return;
        }

        // Add to pool (cap at 20 recipes max)
        if (existingPool.length >= 20) {
            alert('Pool is full (max 20 recipes). Remove a recipe to add more.');
            navigate('/meal-planner');
            return;
        }

        const updatedPool = [...existingPool, poolRecipe];
        localStorage.setItem('recipePool', JSON.stringify(updatedPool));

        alert(`Added "${recipe.title}" to your meal plan pool!`);
        navigate('/meal-planner');
    };


    const handleBack = () => {
        // If browser has history, go back, or go to recipes
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/recipes');
        }
    };

    const recipeTags = getRecipeTags(recipe);
    const nutritionEntries = NUTRIENT_CONFIG
        .map(({ name, label, unit }) => {
            const value = getNutritionAmount(recipe, name);

            if (value == null) return null;

            return {
                label,
                value,
                unit,
            };
        })
        .filter(Boolean);
    const isManualRecipe = recipe?.id?.startsWith('manual-');

    const handleSaveManualRecipe = (updatedRecipe) => {
        const manualRecipes = JSON.parse(localStorage.getItem('manualRecipes') || '[]');
        const updatedManualRecipes = manualRecipes.map((manualRecipe) =>
            manualRecipe.id === updatedRecipe.id ? updatedRecipe : manualRecipe
        );

        localStorage.setItem('manualRecipes', JSON.stringify(updatedManualRecipes));
        setRecipe(updatedRecipe);
        setIsEditModalOpen(false);
    };


    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-mainbg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }


    // Error state
    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-mainbg flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-primaryDark mb-4">
                        {error || 'Recipe not found'}
                    </h2>

                    <button
                        onClick={() => navigate('/recipes')}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
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

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="mb-6 text-primary hover:text-primaryDark font-medium flex items-center gap-2"
                >
                    <span>←</span> Back to Recipes
                </button>


                {/* Recipe Header Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">


                    {/* Recipe Image */}
                    <div className="bg-card rounded-lg shadow-md overflow-hidden">
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/assets/images/placeholder-recipe.png';
                            }}
                        />
                    </div>


                    {/* Recipe Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="mb-6 flex items-start justify-between gap-4">
                                <h1 className="text-4xl font-bold text-primaryDark">
                                    {recipe.title}
                                </h1>

                                {isManualRecipe && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-primaryDark"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z" />
                                        </svg>
                                        Edit
                                    </button>
                                )}
                            </div>

                            {/* Time & Servings */}
                            <div className="flex gap-12 mb-6">
                                <div className="text-center">
                                    <div className="text-xs text-muted uppercase mb-1">Servings</div>
                                    <div className="text-3xl font-bold text-primary">{recipe.servings}</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-muted uppercase mb-1">Prep Time</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {recipe.preparationMinutes || 0}min
                                    </div>
                                </div>

                                <div className="text-center">
                                    <div className="text-xs text-muted uppercase mb-1">Cook Time</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {recipe.cookingMinutes || 0}min
                                    </div>
                                </div>

                            </div>
                        </div>


                        {/* Nutrition Info */}
                        <div className="bg-card rounded-lg shadow-md p-6">
                            {nutritionEntries.length > 0 ? (
                                <>
                                    <h3 className="text-sm font-semibold text-primaryDark mb-4">
                                        Nutrition Info (per serving)
                                    </h3>

                                    <div className="grid grid-cols-3 gap-6 text-center">
                                        {nutritionEntries.map((entry) => (
                                            <div key={entry.label}>
                                                <div className="text-2xl font-bold text-primaryDark">
                                                    {entry.value}{entry.unit}
                                                </div>

                                                <div className="text-xs text-muted">{entry.label}</div>
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
                                            className="rounded-full bg-subtle px-3 py-1 text-xs font-medium text-primaryDark"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>


                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={addToGroceryList}
                                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium shadow-md text-lg"
                            >
                                Add to Grocery List
                            </button>

                            <button
                                onClick={addToMealPlan}
                                className="w-full py-3 bg-card text-primary border-2 border-primary rounded-lg hover:bg-subtle transition-colors font-medium text-lg"
                            >
                                Add to Meal Plan
                            </button>

                        </div>

                    </div>
                </div>


                {/* Ingredients Section */}
                <div className="bg-card rounded-lg shadow-md p-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-primaryDark">Ingredients</h2>
                    </div>


                    {/* Ingredients Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {recipe.extendedIngredients.map((ingredient, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 rounded-lg bg-subtle border border-gray-200"
                            >
                                <div className="font-medium text-primaryDark">
                                    {ingredient.name}
                                </div>

                                <div className="text-sm text-muted ml-4">
                                    {ingredient.amount} {ingredient.unit}
                                </div>

                            </div>
                        ))}
                    </div>


                    {/* Bottom hint */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-muted text-center">
                            Click "Add to Grocery List" to add all ingredients to your shopping list
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
