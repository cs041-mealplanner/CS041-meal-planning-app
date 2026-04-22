import { useState } from 'react';

const FILTER_TAGS = ['Vegetarian', 'Vegan', 'High Protein', 'Low Carb'];
const OPTIONAL_NUTRIENTS = [
    { field: 'calories', name: 'Calories' },
    { field: 'protein', name: 'Protein' },
    { field: 'carbs', name: 'Carbohydrates' },
    { field: 'fat', name: 'Fat' },
    { field: 'fiber', name: 'Fiber' },
    { field: 'sodium', name: 'Sodium' },
];
const DEFAULT_INGREDIENT = { name: '', amount: '', unit: '', aisle: 'Pantry' };

function createEmptyFormData() {
    return {
        title: '',
        image: '',
        servings: 4,
        preparationMinutes: 0,
        cookingMinutes: 0,
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: '',
        sodium: '',
    };
}

function getNutrientValue(recipe, nutrientName) {
    const nutrient = recipe?.nutrition?.nutrients?.find((item) => item.name === nutrientName);
    return nutrient?.amount != null ? String(nutrient.amount) : '';
}

function getInitialFormData(recipe) {
    if (!recipe) return createEmptyFormData();

    return {
        title: recipe.title || '',
        image: recipe.image || '',
        servings: recipe.servings ?? 4,
        preparationMinutes: recipe.preparationMinutes ?? 0,
        cookingMinutes: recipe.cookingMinutes ?? 0,
        calories: getNutrientValue(recipe, 'Calories'),
        protein: getNutrientValue(recipe, 'Protein'),
        carbs: getNutrientValue(recipe, 'Carbohydrates'),
        fat: getNutrientValue(recipe, 'Fat'),
        fiber: getNutrientValue(recipe, 'Fiber'),
        sodium: getNutrientValue(recipe, 'Sodium'),
    };
}

function getInitialIngredients(recipe) {
    if (!recipe?.extendedIngredients?.length) return [{ ...DEFAULT_INGREDIENT }];

    return recipe.extendedIngredients.map((ingredient) => ({
        name: ingredient.name || '',
        amount: ingredient.amount != null ? String(ingredient.amount) : '',
        unit: ingredient.unit || '',
        aisle: ingredient.aisle || 'Pantry',
    }));
}


export default function AddRecipe({
    isOpen,
    onClose,
    onSave,
    existingRecipe = null,
    modalTitle = 'Create Recipe',
    submitLabel = 'Save Recipe',
}) {
    const [formData, setFormData] = useState(() => getInitialFormData(existingRecipe));


    const [ingredients, setIngredients] = useState(() => getInitialIngredients(existingRecipe));
    const [selectedTags, setSelectedTags] = useState(existingRecipe?.tags || []);

    const categories = ['Produce', 'Meat & Poultry', 'Pantry', 'Spices & Seasonings', 'Dairy', 'Pasta and Rice', 'Baking'];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleIngredientChange = (index, field, value) => {
        const updated = [...ingredients];
        updated[index][field] = value;
        setIngredients(updated);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { ...DEFAULT_INGREDIENT }]);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const toggleTag = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag)
                ? prev.filter((value) => value !== tag)
                : [...prev, tag]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        // Validate required fields
        if (!formData.title.trim()) {
            alert('Please enter a recipe name');
            return;
        }

        const validIngredients = ingredients.filter(ing => ing.name.trim());
        if (validIngredients.length === 0) {
            alert('Please add at least one ingredient');
            return;
        }


        // manual recipe in Spoonacular format
        const nutrients = OPTIONAL_NUTRIENTS
            .map(({ field, name }) => {
                const rawValue = formData[field];

                if (rawValue === '') return null;

                return {
                    name,
                    amount: parseFloat(rawValue) || 0,
                };
            })
            .filter(Boolean);

        const manualRecipe = {
            id: existingRecipe?.id || `manual-${Date.now()}`,
            title: formData.title,
            image: formData.image || 'https://placehold.co/400x300/E8E3D8/6B8E6F?text=No+Image',
            servings: parseInt(formData.servings) || 1,
            preparationMinutes: parseInt(formData.preparationMinutes) || 0,
            cookingMinutes: parseInt(formData.cookingMinutes) || 0,
            nutrition: nutrients.length > 0 ? { nutrients } : undefined,
            tags: selectedTags,
            extendedIngredients: validIngredients.map(ing => ({
                name: ing.name,
                amount: parseFloat(ing.amount) || 1,
                unit: ing.unit || 'item',
                aisle: ing.aisle
            }))
        };


        onSave(manualRecipe);


        // Reset form
        setFormData(createEmptyFormData());
        setIngredients([{ ...DEFAULT_INGREDIENT }]);
        setSelectedTags([]);
        onClose();
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-card rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
                <div className="sticky top-0 bg-card border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primaryDark">{modalTitle}</h2>
                    <button
                        onClick={onClose}
                        className="text-muted hover:text-primaryDark text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>


                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primaryDark">Basic Information</h3>

                        <div>
                            <label className="block text-sm font-medium text-primaryDark mb-1">
                                Recipe Name *
                            </label>

                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., Spaghetti Carbonara"
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-primaryDark mb-1">
                                Image URL (optional)
                            </label>

                            <input
                                type="url"
                                value={formData.image}
                                onChange={(e) => handleInputChange('image', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>


                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Servings</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.servings}
                                    onChange={(e) => handleInputChange('servings', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Prep (min)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.preparationMinutes}
                                    onChange={(e) => handleInputChange('preparationMinutes', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Cook (min)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.cookingMinutes}
                                    onChange={(e) => handleInputChange('cookingMinutes', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Nutrition */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-primaryDark">Nutrition (per serving)</h3>
                            <p className="mt-1 text-sm text-muted">
                                Optional. Leave any nutrition fields blank if you do not want them shown on the recipe details page.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Calories</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.calories}
                                    onChange={(e) => handleInputChange('calories', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Protein (g)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.protein}
                                    onChange={(e) => handleInputChange('protein', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Carbs (g)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.carbs}
                                    onChange={(e) => handleInputChange('carbs', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Fat (g)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.fat}
                                    onChange={(e) => handleInputChange('fat', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Fiber (g)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={formData.fiber}
                                    onChange={(e) => handleInputChange('fiber', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primaryDark mb-1">Sodium (mg)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.sodium}
                                    onChange={(e) => handleInputChange('sodium', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                        </div>
                    </div>


                    {/* Ingredients */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-primaryDark">Ingredients *</h3>

                            <button
                                type="button"
                                onClick={addIngredient}
                                className="text-primary hover:text-primaryDark font-medium text-sm"
                            >
                                + Add Ingredient
                            </button>
                        </div>

                        <div className="space-y-3">
                            {ingredients.map((ing, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-start">
                                    <input
                                        type="text"
                                        value={ing.name}
                                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                        placeholder="Ingredient name"
                                        className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />

                                    <input
                                        type="number"
                                        step="0.1"
                                        value={ing.amount}
                                        onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                                        placeholder="Amount"
                                        className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />

                                    <input
                                        type="text"
                                        value={ing.unit}
                                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                        placeholder="Unit"
                                        className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />

                                    <select
                                        value={ing.aisle}
                                        onChange={(e) => handleIngredientChange(index, 'aisle', e.target.value)}
                                        className="col-span-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() => removeIngredient(index)}
                                        className="col-span-1 text-red-600 hover:text-red-800 font-bold text-lg"
                                    >
                                        ×
                                    </button>

                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-primaryDark">Tags & Filters</h3>
                            <p className="mt-1 text-sm text-muted">
                                Optional. These help your custom recipe show up when users filter recipes and can be left blank.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {FILTER_TAGS.map((tag) => {
                                const isSelected = selectedTags.includes(tag);

                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                                            isSelected
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-200 bg-card text-primaryDark hover:bg-subtle'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                );
                            })}
                        </div>
                    </div>


                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-subtle text-primaryDark rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
                        >
                            {submitLabel}
                        </button>

                    </div>
                </form>

            </div>
        </div>
    );
}
