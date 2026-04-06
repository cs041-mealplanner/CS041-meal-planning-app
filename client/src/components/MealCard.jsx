// Meal section for Dashboard

export default function MealCard({ dish }) {
    return (
        <div className="bg-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">

            {/* Dish Image */}
            <div className="aspect-video w-full overflow-hidden bg-subtle">
                <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = '/assets/images/placeholder-recipe.png';
                    }}
                />
            </div>


            {/* Dish Info */}
            <div className="p-4">
                <h3 className="font-semibold text-primaryDark text-lg mb-1">
                    {dish.name}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted">
                    <span>{dish.nutrition.calories} kcal</span>
                    <span>•</span>
                    <span>{dish.prep_time + dish.cook_time} min</span>
                </div>
            </div>
        </div>
    );
}
