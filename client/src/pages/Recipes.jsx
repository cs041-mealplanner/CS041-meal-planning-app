import { useCallback, useEffect, useState } from 'react';
import AddRecipe from '../components/AddRecipe';
import RecipeCard from '../components/RecipeCard';
import {
    createManualRecipe,
    isPersistedSpoonacularRecipeMatch,
    listRecipes,
} from '../features/recipes/recipeStorage';

const FILTER_TAGS = ['All', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb'];
const RECIPES_PER_PAGE = 6;
const MAX_RECIPES = 18;
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';
let hasWarnedMissingSpoonacularKey = false;

function normalizeRecipeTags(recipe) {
    if (!Array.isArray(recipe?.tags)) return [];
    return recipe.tags
        .filter((tag) => typeof tag === 'string')
        .map((tag) => tag.trim().toLowerCase());
}

function getRecipeTitle(recipe) {
    if (typeof recipe?.title === 'string' && recipe.title.trim()) return recipe.title;
    if (typeof recipe?.name === 'string' && recipe.name.trim()) return recipe.name;
    return '';
}

function recipeMatchesSearch(recipe, searchQuery) {
    if (!searchQuery) return true;
    return getRecipeTitle(recipe).toLowerCase().includes(searchQuery.toLowerCase());
}

function recipeMatchesFilter(recipe, activeFilter) {
    if (activeFilter === 'All') return true;
    return normalizeRecipeTags(recipe).includes(activeFilter.toLowerCase());
}

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [storedRecipes, setStoredRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [displayCount, setDisplayCount] = useState(RECIPES_PER_PAGE);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadStoredRecipes() {
            try {
                const persistedRecipes = await listRecipes();

                if (isMounted) {
                    setStoredRecipes(persistedRecipes);
                }
            } catch (err) {
                console.error('Failed to load persisted recipes:', err);

                if (isMounted) {
                    setError('Unable to load your saved recipes right now.');
                }
            }
        }

        loadStoredRecipes();

        return () => {
            isMounted = false;
        };
    }, []);

    const shuffleArray = (array) => {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    const fetchRecipes = useCallback(async () => {
        const filteredStoredRecipes = storedRecipes.filter((recipe) =>
            recipeMatchesSearch(recipe, searchQuery) &&
            recipeMatchesFilter(recipe, activeFilter)
        );

        if (!API_KEY) {
            if (!hasWarnedMissingSpoonacularKey) {
                console.warn('Spoonacular API key not configured.');
                hasWarnedMissingSpoonacularKey = true;
            }

            const shuffled = shuffleArray(filteredStoredRecipes);
            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE));
            setDisplayCount(RECIPES_PER_PAGE);

            return;
        }

        setLoading(true);
        setError(null);

        try {
            let url = `${API_BASE}/complexSearch?apiKey=${API_KEY}&number=50&addRecipeNutrition=true&fillIngredients=true`;

            if (searchQuery) {
                url += `&query=${encodeURIComponent(searchQuery)}`;
            }

            switch (activeFilter) {
                case 'Vegetarian':
                    url += '&diet=vegetarian';
                    break;
                case 'Vegan':
                    url += '&diet=vegan';
                    break;
                case 'High Protein':
                    url += '&minProtein=25';
                    break;
                case 'Low Carb':
                    url += '&maxCarbs=30';
                    break;
                default:
                    break;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch recipes. Please try again.');
            }

            const data = await response.json();
            const dedupedApiRecipes = data.results.filter(
                (recipe) => !filteredStoredRecipes.some(
                    (storedRecipe) => isPersistedSpoonacularRecipeMatch(storedRecipe, recipe.id)
                )
            );

            const combined = [...filteredStoredRecipes, ...dedupedApiRecipes];
            const shuffled = shuffleArray(combined);

            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE));
            setDisplayCount(RECIPES_PER_PAGE);
        } catch (err) {
            setError(err.message);

            const shuffled = shuffleArray(filteredStoredRecipes);
            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE));
            setDisplayCount(RECIPES_PER_PAGE);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, searchQuery, storedRecipes]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput.trim());
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleLoadMore = () => {
        const newDisplayCount = Math.min(displayCount + RECIPES_PER_PAGE, MAX_RECIPES, allRecipes.length);
        setDisplayCount(newDisplayCount);
        setRecipes(allRecipes.slice(0, newDisplayCount));
    };

    const hasMore = displayCount < Math.min(MAX_RECIPES, allRecipes.length);

    const handleBrowseAll = () => {
        setSearchInput('');
        setSearchQuery('');
        setActiveFilter('All');
    };

    const handleSaveManualRecipe = async (newRecipe) => {
        const createdRecipe = await createManualRecipe(newRecipe);
        setStoredRecipes((prev) => [...prev, createdRecipe]);
    };

    return (
        <div className="min-h-screen bg-mainbg">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <div className="mb-8 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-primaryDark sm:text-4xl lg:text-5xl">
                                Browse Recipes
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
                                Search, filter, and find meals that fit your week.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="hidden lg:inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-card px-6 py-3 font-bold text-primary transition-colors hover:bg-subtle"
                        >
                            <span className="text-xl leading-none">+</span>
                            Create Recipe
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="mb-5">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <div className="relative flex-1">
                                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search recipes by name..."
                                    className="w-full rounded-2xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-base text-primaryDark shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-2xl bg-primary px-7 py-4 font-bold text-white shadow-sm transition-colors hover:bg-primaryDark md:w-auto"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    <div className="relative -mx-5 sm:-mx-7 lg:mx-0">
                        <div className="flex gap-3 overflow-x-auto px-5 pb-1 sm:px-7 lg:flex-wrap lg:overflow-visible lg:px-0">
                            {FILTER_TAGS.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => handleFilterChange(tag)}
                                    className={`shrink-0 rounded-full px-5 py-3 font-semibold transition-colors ${activeFilter === tag
                                            ? 'bg-primary text-white'
                                            : 'border border-gray-200 bg-white text-primaryDark hover:bg-subtle'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-card to-transparent lg:hidden" />
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-white px-6 py-4 font-bold text-primary transition-colors hover:bg-subtle lg:hidden"
                    >
                        <span className="text-xl leading-none">+</span>
                        Create Recipe
                    </button>
                </div>

                {error && (
                    <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                        <p className="mb-4 text-red-800">{error}</p>

                        <button
                            onClick={fetchRecipes}
                            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {loading && recipes.length === 0 && (
                    <div className="flex items-center justify-center py-20">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                )}

                {!loading && recipes.length === 0 && searchQuery && !error && (
                    <div className="rounded-3xl bg-card px-5 py-16 text-center shadow-sm sm:px-8 sm:py-20">
                        <svg className="mx-auto mb-4 h-16 w-16 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <h3 className="mb-2 text-xl font-semibold text-primaryDark">
                            No recipes found for "{searchQuery}"
                        </h3>

                        <p className="mb-6 text-muted">
                            Try a different keyword or clear your search.
                        </p>

                        <button
                            onClick={handleBrowseAll}
                            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primaryDark"
                        >
                            Browse All Recipes
                        </button>
                    </div>
                )}

                {recipes.length > 0 && (
                    <>
                        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {recipes.map((recipe) => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>

                        {hasMore && !loading && (
                            <div className="text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="rounded-2xl border-2 border-primary bg-card px-8 py-3 font-bold text-primaryDark transition-colors hover:bg-subtle"
                                >
                                    Load More
                                </button>
                            </div>
                        )}

                        {loading && recipes.length > 0 && (
                            <div className="flex justify-center py-8">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                            </div>
                        )}

                        {!hasMore && recipes.length > 0 && (
                            <div className="py-8 text-center">
                                <p className="text-muted">
                                    {recipes.length >= MAX_RECIPES
                                        ? `Showing ${MAX_RECIPES} recipes. Try adjusting your filters for different results.`
                                        : "That's everything! Try adding a new recipe or adjusting your filters to see more recipes."}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isModalOpen && (
                <AddRecipe
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveManualRecipe}
                />
            )}
        </div>
    );
}