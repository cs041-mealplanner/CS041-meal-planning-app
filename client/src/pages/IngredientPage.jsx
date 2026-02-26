import { useNavigate, useParams } from 'react-router-dom';
import dishesData from '../data/dish.json';

function RecipeDetail() {
    const { id } = useParams();   // get recipe ID from URL
    const navigate = useNavigate();

    // load recipe data (TEMPORARY - replace with API call in future)
    // useEffect(() => {
    //     const recipeData = dishesData.find(dish => dish.id === parseInt(id));
    //     if (recipeData) {
    //         setRecipe(recipeData);
    //     }
    // }, [id]);

    const recipe = dishesData.find(
        dish => dish.id === parseInt(id, 10)
    ) || null;

    const addToGroceryList = () => {
        // get existing grocery list from localStorage
        const existingList = JSON.parse(localStorage.getItem('groceryList') || '[]');

        // add ALL ingredient from this recipe
        const newItems = recipe.ingredients.map((item, idx) => ({
            id: Date.now() + Math.random() + idx,
            name: item.item,
            quantity: item.amount,
            category: item.category,
            source: `From ${recipe.name}`,
            checked: false
        }));


        const updatedList = [...existingList, ...newItems];
        localStorage.setItem('groceryList', JSON.stringify(updatedList));

        alert(`Added all ${recipe.ingredients.length} ingredients to your grocery list!`);
        navigate('/grocery');
    };


    // loading state
    if (!recipe) {
        return (
            <div className="min-h-screen bg-[#E8E3D8] flex items-center justify-center">
                <div className="text-xl text-gray-600">Recipe not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#E8E3D8]">
            {/* main content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* recipe header section */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    {/* recipe image */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="500" height="400"%3E%3Crect fill="%23E8E3D8" width="500" height="400"/%3E%3Ctext fill="%236B8E6F" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    </div>


                    {/* Recipe Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-6">{recipe.name}</h1>

                            {/* Time & Servings */}
                            <div className="flex gap-12 text-center mb-6">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">Servings</div>
                                    <div className="text-3xl font-bold text-[#6B8E6F]">{recipe.servings}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">Prep Time</div>
                                    <div className="text-3xl font-bold text-[#6B8E6F]">{recipe.prep_time}min</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 uppercase mb-1">Cook Time</div>
                                    <div className="text-3xl font-bold text-[#6B8E6F]">{recipe.cook_time} min</div>
                                </div>
                            </div>
                        </div>


                        {/* Nutrition Info */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-4">Nutrition info (per serving)</h3>
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.calories}</div>
                                    <div className="text-xs text-gray-500">Calories</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.protein}g</div>
                                    <div className="text-xs text-gray-500">Protein</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.carbs}g</div>
                                    <div className="text-xs text-gray-500">Carbs</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.fat}g</div>
                                    <div className="text-xs text-gray-500">Fat</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.fiber}g</div>
                                    <div className="text-xs text-gray-500">Fiber</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">{recipe.nutrition.sodium}mg</div>
                                    <div className="text-xs text-gray-500">Sodium</div>
                                </div>
                            </div>
                        </div>


                        {/* Add to Grocery List Button */}
                        <button
                            onClick={addToGroceryList}
                            className="w-full py-3 bg-[#6B8E6F] text-white rounded-lg hover:bg-[#5a7a5e] transition-colors font-medium shadow-md text-lg"
                        >
                            Add to Grocery List
                        </button>
                    </div>
                </div>


                {/* Ingredients Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Ingredients</h2>
                    </div>


                    {/* Ingredients Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {recipe.ingredients.map((ingredient, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                                <div className="font-medium text-gray-800">
                                    {ingredient.item}
                                </div>
                                <div className="text-sm text-gray-500 ml-4">
                                    {ingredient.amount}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Bottom hint */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 text-center">
                            Click "Add to Grocery List" to add all ingredients to your shopping list
                        </p>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <footer className="mt-12 pb-8 text-center text-sm text-gray-500">
                © Nourishly 2025 • <a href="#" className="hover:text-gray-700">Privacy</a> • <a href="#" className="hover:text-gray-700">Terms</a>
            </footer>
        </div>
    );
}

export default RecipeDetail;