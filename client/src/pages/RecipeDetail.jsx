import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';


export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchRecipeDetail = async () => {
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
        // TODO: Implement add to meal plan functionality
        alert('Add to Meal Plan - Coming soon!');
    };


    const handleBack = () => {
        // If browser has history, go back; otherwise go to recipes
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/recipes');
        }
    };


    // Helper to get nutrition value
    const getNutritionValue = (nutrientName) => {
        if (!recipe?.nutrition?.nutrients) return 0;
        const nutrient = recipe.nutrition.nutrients.find(n => n.name === nutrientName);
        return nutrient ? Math.round(nutrient.amount) : 0;
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
                            <h1 className="text-4xl font-bold text-primaryDark mb-6">
                                {recipe.title}
                            </h1>


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
                            <h3 className="text-sm font-semibold text-primaryDark mb-4">
                                Nutrition Info (per serving)
                            </h3>

                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Calories')}
                                    </div>

                                    <div className="text-xs text-muted">Calories</div>
                                </div>

                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Protein')}g
                                    </div>

                                    <div className="text-xs text-muted">Protein</div>
                                </div>

                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Carbohydrates')}g
                                    </div>

                                    <div className="text-xs text-muted">Carbs</div>
                                </div>

                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Fat')}g
                                    </div>

                                    <div className="text-xs text-muted">Fat</div>
                                </div>

                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Fiber')}g
                                    </div>

                                    <div className="text-xs text-muted">Fiber</div>
                                </div>

                                <div>
                                    <div className="text-2xl font-bold text-primaryDark">
                                        {getNutritionValue('Sodium')}mg
                                    </div>

                                    <div className="text-xs text-muted">Sodium</div>
                                </div>
                            </div>
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
