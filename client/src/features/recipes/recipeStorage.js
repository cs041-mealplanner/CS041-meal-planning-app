import { getMigratedScopedJson, setScopedJson } from "../../lib/userStorage";

const MANUAL_RECIPES_KEY = "manualRecipes";
const RECIPE_POOL_KEY = "recipePool";
const STARTER_RECIPES_SEEDED_KEY = "starterRecipesSeeded";

const STARTER_RECIPES = [
  {
    id: "starter-overnight-oats",
    title: "Overnight Oats with Berries",
    image: "https://images.pexels.com/photos/34248624/pexels-photo-34248624.jpeg",
    servings: 1,
    preparationMinutes: 10,
    cookingMinutes: 0,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320 },
        { name: "Protein", amount: 16 },
        { name: "Carbohydrates", amount: 42 },
        { name: "Fat", amount: 10 },
        { name: "Fiber", amount: 7 },
        { name: "Sodium", amount: 120 },
      ],
    },
    tags: ["Vegetarian"],
    extendedIngredients: [
      { name: "rolled oats", amount: 0.5, unit: "cup", aisle: "Pantry" },
      { name: "milk", amount: 0.5, unit: "cup", aisle: "Dairy" },
      { name: "chia seeds", amount: 1, unit: "tbsp", aisle: "Pantry" },
      { name: "mixed berries", amount: 0.5, unit: "cup", aisle: "Produce" },
    ],
  },
  {
    id: "starter-eggs-toast",
    title: "Scrambled Eggs and Toast",
    image: "https://images.pexels.com/photos/32334384/pexels-photo-32334384.jpeg",
    servings: 1,
    preparationMinutes: 5,
    cookingMinutes: 10,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290 },
        { name: "Protein", amount: 18 },
        { name: "Carbohydrates", amount: 18 },
        { name: "Fat", amount: 15 },
        { name: "Fiber", amount: 2 },
        { name: "Sodium", amount: 310 },
      ],
    },
    tags: ["Vegetarian", "High Protein"],
    extendedIngredients: [
      { name: "eggs", amount: 2, unit: "large", aisle: "Dairy" },
      { name: "bread", amount: 2, unit: "slices", aisle: "Pantry" },
      { name: "butter", amount: 1, unit: "tsp", aisle: "Dairy" },
    ],
  },
  {
    id: "starter-greek-yogurt-parfait",
    title: "Greek Yogurt Parfait",
    image: "https://images.pexels.com/photos/36824672/pexels-photo-36824672.jpeg",
    servings: 1,
    preparationMinutes: 10,
    cookingMinutes: 0,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 260 },
        { name: "Protein", amount: 21 },
        { name: "Carbohydrates", amount: 24 },
        { name: "Fat", amount: 8 },
        { name: "Fiber", amount: 3 },
        { name: "Sodium", amount: 85 },
      ],
    },
    tags: ["Vegetarian", "High Protein"],
    extendedIngredients: [
      { name: "greek yogurt", amount: 1, unit: "cup", aisle: "Dairy" },
      { name: "granola", amount: 0.25, unit: "cup", aisle: "Pantry" },
      { name: "strawberries", amount: 0.5, unit: "cup", aisle: "Produce" },
      { name: "honey", amount: 1, unit: "tbsp", aisle: "Pantry" },
    ],
  },
  {
    id: "starter-turkey-sandwich",
    title: "Turkey Sandwich",
    image: "https://images.pexels.com/photos/28681955/pexels-photo-28681955.jpeg",
    servings: 1,
    preparationMinutes: 10,
    cookingMinutes: 0,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 390 },
        { name: "Protein", amount: 29 },
        { name: "Carbohydrates", amount: 30 },
        { name: "Fat", amount: 16 },
        { name: "Fiber", amount: 4 },
        { name: "Sodium", amount: 620 },
      ],
    },
    tags: ["High Protein"],
    extendedIngredients: [
      { name: "whole wheat bread", amount: 2, unit: "slices", aisle: "Pantry" },
      { name: "turkey slices", amount: 4, unit: "oz", aisle: "Meat & Poultry" },
      { name: "lettuce", amount: 2, unit: "leaves", aisle: "Produce" },
      { name: "tomato", amount: 4, unit: "slices", aisle: "Produce" },
    ],
  },
  {
    id: "starter-chicken-rice-bowl",
    title: "Chicken Rice Bowl",
    image: "https://images.pexels.com/photos/24778216/pexels-photo-24778216.png",
    servings: 2,
    preparationMinutes: 15,
    cookingMinutes: 20,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 430 },
        { name: "Protein", amount: 34 },
        { name: "Carbohydrates", amount: 36 },
        { name: "Fat", amount: 12 },
        { name: "Fiber", amount: 4 },
        { name: "Sodium", amount: 410 },
      ],
    },
    tags: ["High Protein"],
    extendedIngredients: [
      { name: "chicken breast", amount: 8, unit: "oz", aisle: "Meat & Poultry" },
      { name: "rice", amount: 1, unit: "cup", aisle: "Pasta and Rice" },
      { name: "broccoli", amount: 1, unit: "cup", aisle: "Produce" },
      { name: "soy sauce", amount: 1, unit: "tbsp", aisle: "Pantry" },
    ],
  },
  {
    id: "starter-caesar-salad",
    title: "Chicken Caesar Salad",
    image: "https://images.pexels.com/photos/35532838/pexels-photo-35532838.jpeg",
    servings: 2,
    preparationMinutes: 15,
    cookingMinutes: 10,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 360 },
        { name: "Protein", amount: 30 },
        { name: "Carbohydrates", amount: 14 },
        { name: "Fat", amount: 20 },
        { name: "Fiber", amount: 3 },
        { name: "Sodium", amount: 540 },
      ],
    },
    tags: ["High Protein", "Low Carb"],
    extendedIngredients: [
      { name: "romaine lettuce", amount: 1, unit: "head", aisle: "Produce" },
      { name: "chicken breast", amount: 6, unit: "oz", aisle: "Meat & Poultry" },
      { name: "parmesan", amount: 0.25, unit: "cup", aisle: "Dairy" },
      { name: "caesar dressing", amount: 3, unit: "tbsp", aisle: "Pantry" },
    ],
  },
  {
    id: "starter-veggie-stir-fry",
    title: "Veggie Stir Fry",
    image: "https://images.pexels.com/photos/10695966/pexels-photo-10695966.jpeg",
    servings: 2,
    preparationMinutes: 15,
    cookingMinutes: 15,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 300 },
        { name: "Protein", amount: 14 },
        { name: "Carbohydrates", amount: 28 },
        { name: "Fat", amount: 12 },
        { name: "Fiber", amount: 6 },
        { name: "Sodium", amount: 350 },
      ],
    },
    tags: ["Vegetarian", "Vegan"],
    extendedIngredients: [
      { name: "tofu", amount: 8, unit: "oz", aisle: "Produce" },
      { name: "bell pepper", amount: 1, unit: "whole", aisle: "Produce" },
      { name: "broccoli", amount: 1, unit: "cup", aisle: "Produce" },
      { name: "brown rice", amount: 1, unit: "cup", aisle: "Pasta and Rice" },
    ],
  },
  {
    id: "starter-pasta-marinara",
    title: "Pasta with Marinara",
    image: "https://images.pexels.com/photos/32632538/pexels-photo-32632538.jpeg",
    servings: 2,
    preparationMinutes: 10,
    cookingMinutes: 20,
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 410 },
        { name: "Protein", amount: 13 },
        { name: "Carbohydrates", amount: 62 },
        { name: "Fat", amount: 10 },
        { name: "Fiber", amount: 6 },
        { name: "Sodium", amount: 480 },
      ],
    },
    tags: ["Vegetarian", "Vegan"],
    extendedIngredients: [
      { name: "pasta", amount: 8, unit: "oz", aisle: "Pasta and Rice" },
      { name: "marinara sauce", amount: 1.5, unit: "cups", aisle: "Pantry" },
      { name: "olive oil", amount: 1, unit: "tbsp", aisle: "Pantry" },
      { name: "garlic", amount: 2, unit: "cloves", aisle: "Produce" },
    ],
  },
];

function cloneStarterRecipes() {
  return JSON.parse(JSON.stringify(STARTER_RECIPES));
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function getNutrientAmount(recipe, nutrientName) {
  const nutritionFieldMap = {
    Calories: "calories",
    Protein: "protein",
    Carbohydrates: "carbs",
    Fat: "fat",
    Fiber: "fiber",
    Sodium: "sodium",
  };

  const fieldName = nutritionFieldMap[nutrientName] || nutrientName.toLowerCase();

  if (recipe?.nutrition?.[fieldName] != null) {
    return Number(recipe.nutrition[fieldName]) || 0;
  }

  const nutrient = recipe?.nutrition?.nutrients?.find((item) => item.name === nutrientName);
  return nutrient?.amount != null ? Number(nutrient.amount) || 0 : 0;
}

function normalizeIngredients(recipe) {
  if (Array.isArray(recipe?.ingredients)) {
    return recipe.ingredients.map((ingredient) => ({
      item: ingredient.item,
      amount: ingredient.amount,
      category: ingredient.category || "Pantry",
    }));
  }

  return ensureArray(recipe?.extendedIngredients).map((ingredient) => ({
    item: ingredient.name,
    amount: `${ingredient.amount} ${ingredient.unit}`.trim(),
    category: ingredient.aisle || "Pantry",
  }));
}

export function getManualRecipes() {
  return ensureArray(getMigratedScopedJson(MANUAL_RECIPES_KEY, []));
}

export function saveManualRecipes(recipes) {
  setScopedJson(MANUAL_RECIPES_KEY, ensureArray(recipes));
}

export function getRecipePool() {
  return ensureArray(getMigratedScopedJson(RECIPE_POOL_KEY, []));
}

export function saveRecipePool(recipes) {
  setScopedJson(RECIPE_POOL_KEY, ensureArray(recipes));
}

export function normalizeRecipeForPlanner(recipe) {
  const normalizedName = recipe?.name || recipe?.title || "Untitled Recipe";

  return {
    id: recipe.id,
    name: normalizedName,
    title: normalizedName,
    image: recipe.image || "https://placehold.co/600x400/E8E3D8/3E4A3F?text=Recipe",
    servings: recipe.servings ?? 1,
    prep_time: recipe.prep_time ?? recipe.preparationMinutes ?? 0,
    cook_time: recipe.cook_time ?? recipe.cookingMinutes ?? 0,
    nutrition: {
      calories: getNutrientAmount(recipe, "Calories"),
      protein: getNutrientAmount(recipe, "Protein"),
      carbs: getNutrientAmount(recipe, "Carbohydrates"),
      fat: getNutrientAmount(recipe, "Fat"),
      fiber: getNutrientAmount(recipe, "Fiber"),
      sodium: getNutrientAmount(recipe, "Sodium"),
    },
    tags: ensureArray(recipe?.tags),
    ingredients: normalizeIngredients(recipe),
  };
}

export function normalizeRecipesForPlanner(recipes) {
  return ensureArray(recipes).map(normalizeRecipeForPlanner);
}

export function isLocalRecipeId(recipeId) {
  return typeof recipeId === "string" && (recipeId.startsWith("manual-") || recipeId.startsWith("starter-"));
}

function migrateStarterRecipeImages(recipes) {
  const starterImageMap = new Map(
    STARTER_RECIPES.map((recipe) => [recipe.id, recipe.image])
  );

  let changed = false;
  const nextRecipes = ensureArray(recipes).map((recipe) => {
    if (!starterImageMap.has(recipe.id)) return recipe;

    const nextImage = starterImageMap.get(recipe.id);
    const currentImage = recipe?.image;
    const shouldUpgradeImage =
      typeof currentImage !== "string" ||
      !currentImage.trim() ||
      currentImage.includes("placehold.co");

    if (!shouldUpgradeImage || currentImage === nextImage) {
      return recipe;
    }

    changed = true;
    return {
      ...recipe,
      image: nextImage,
    };
  });

  return { changed, recipes: nextRecipes };
}

export function ensureStarterRecipesSeeded() {
  const migratedManualRecipes = migrateStarterRecipeImages(getManualRecipes());
  if (migratedManualRecipes.changed) {
    saveManualRecipes(migratedManualRecipes.recipes);
  }

  const hasSeeded = Boolean(getMigratedScopedJson(STARTER_RECIPES_SEEDED_KEY, false));

  if (hasSeeded) return false;

  const manualRecipes = migratedManualRecipes.recipes;
  const recipePool = getRecipePool();

  if (manualRecipes.length > 0 || recipePool.length > 0) {
    setScopedJson(STARTER_RECIPES_SEEDED_KEY, true);
    return false;
  }

  saveManualRecipes(cloneStarterRecipes());
  setScopedJson(STARTER_RECIPES_SEEDED_KEY, true);
  return true;
}
