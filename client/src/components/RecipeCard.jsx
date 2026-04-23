import { useNavigate } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://placehold.co/800x800/E8E3D8/6B8E6F?text=No+Image';

export default function RecipeCard({ recipe }) {
    const navigate = useNavigate();
    const recipeTitle = recipe.title || recipe.name || 'Recipe';
    const imageSrc = recipe.image || FALLBACK_IMAGE;

    return (
        <div
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="bg-card rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
        >
            <div className="relative aspect-square w-full overflow-hidden bg-subtle">
                <img
                    src={imageSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />

                <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

                <img
                    src={imageSrc}
                    alt={recipeTitle}
                    className="relative z-10 h-full w-full object-contain"
                    onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                />
            </div>


            {/* Recipe Info */}
            <div className="p-4">
                <h3 className="font-semibold text-primaryDark text-lg line-clamp-2 mb-2">
                    {recipeTitle}
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
