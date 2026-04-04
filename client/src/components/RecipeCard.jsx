import { useNavigate } from 'react-router-dom';


export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="bg-card rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
            {/* Recipe Image */}
            <div className="aspect-square w-full overflow-hidden bg-subtle">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/assets/images/placeholder-recipe.png'; // fallback image
                    }}
                />
            </div>


            {/* Recipe Info */}
            <div className="p-4">
                <h3 className="font-semibold text-primaryDark text-lg line-clamp-2 mb-2">
                    {recipe.title}
                </h3>


                {/* Calories */}
                {recipe.nutrition?.nutrients && (
                    <p className="text-muted text-sm">
                        {Math.round(recipe.nutrition.nutrients.find(n => n.name === 'Calories')?.amount || 0)} kcal
                    </p>
                )}
            </div>
        </div>
    );
}
