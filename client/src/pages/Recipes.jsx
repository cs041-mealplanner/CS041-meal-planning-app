import { useCallback, useEffect, useState } from 'react';
import AddRecipe from '../components/AddRecipe';
import RecipeCard from '../components/RecipeCard';


const FILTER_TAGS = ['All', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb'];
const RECIPES_PER_PAGE = 6;
const MAX_RECIPES = 18;     // LOCK at 18 cards max
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';

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
    const [manualRecipes, setManualRecipes] = useState([]);
    const [allRecipes, setAllRecipes] = useState([]);           // store full
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [displayCount, setDisplayCount] = useState(RECIPES_PER_PAGE);      // to show
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Load manual recipes from localStorage on mount
    useEffect(() => {
        const loadManualRecipes = () => {
            const saved = localStorage.getItem('manualRecipes');
            setManualRecipes(saved ? JSON.parse(saved) : []);
        };

        loadManualRecipes();
    }, []);


    // Shuffle array helper
    const shuffleArray = (array) => {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    // fetch recipes from Spoonacular API
    const fetchRecipes = useCallback(async () => {
        const filteredManualRecipes = manualRecipes.filter((recipe) =>
            recipeMatchesSearch(recipe, searchQuery) &&
            recipeMatchesFilter(recipe, activeFilter)
        );

        if (!API_KEY) {
            console.error('Spoonacular API key not configured.');

            // Show manual recipes only if API is not configured
            const shuffled = shuffleArray(filteredManualRecipes);
            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE));
            setDisplayCount(RECIPES_PER_PAGE);

            return;
        }


        setLoading(true);
        setError(null);


        try {
            // Fetch 50 recipes to have a good pool for randomization
            let url = `${API_BASE}/complexSearch?apiKey=${API_KEY}&number=50&addRecipeNutrition=true&fillIngredients=true`;

            // add search query
            if (searchQuery) {
                url += `&query=${encodeURIComponent(searchQuery)}`;
            }

            // add filter parameters
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


            // Combine manual recipes + API recipes, then shuffle
            const combined = [...filteredManualRecipes, ...data.results];
            const shuffled = shuffleArray(combined);


            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE)); // Show first 6
            setDisplayCount(RECIPES_PER_PAGE);

        } catch (err) {
            setError(err.message);

            // error, show manual recipes only
            const shuffled = shuffleArray(filteredManualRecipes);
            setAllRecipes(shuffled);
            setRecipes(shuffled.slice(0, RECIPES_PER_PAGE));
            setDisplayCount(RECIPES_PER_PAGE);

        } finally {
            setLoading(false);
        }
    }, [activeFilter, manualRecipes, searchQuery]);


    // load and when filter changes or manual recipes change
    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);


    // handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };


    // handle filter change
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };


    // handle load more - show more from the shuffled batch
    const handleLoadMore = () => {
        const newDisplayCount = Math.min(displayCount + RECIPES_PER_PAGE, MAX_RECIPES, allRecipes.length);

        setDisplayCount(newDisplayCount);
        setRecipes(allRecipes.slice(0, newDisplayCount));
    };


    // Check if we can load more -- to match the limit we set
    const hasMore = displayCount < Math.min(MAX_RECIPES, allRecipes.length);


    // handle browse all (reset search and filter)
    const handleBrowseAll = () => {
        setSearchInput('');
        setSearchQuery('');

        setActiveFilter('All');
    };


    // Save manual recipe
    const handleSaveManualRecipe = (newRecipe) => {
        const updatedManual = [...manualRecipes, newRecipe];

        setManualRecipes(updatedManual);
        localStorage.setItem('manualRecipes', JSON.stringify(updatedManual));
    };


    return (
        <div className="min-h-screen bg-mainbg">
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Page Header with Create Button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-primaryDark">Browse Recipes</h1>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium flex items-center gap-2"
                    >
                        <span className="text-xl">+</span> Create Recipe
                    </button>
                </div>


                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-3">

                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search recipes by name..."
                            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />

                        <button
                            type="submit"
                            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
                        >
                            Search
                        </button>

                    </div>
                </form>


                {/* Filter Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {FILTER_TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => handleFilterChange(tag)}
                            className={`px-5 py-2 rounded-full font-medium transition-colors ${activeFilter === tag
                                ? 'bg-primary text-white'
                                : 'bg-card text-primaryDark hover:bg-subtle border border-gray-200'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>


                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <p className="text-red-800 mb-4">{error}</p>

                        <button
                            onClick={fetchRecipes}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}


                {/* Loading State */}
                {loading && recipes.length === 0 && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                )}


                {/* Empty State (IF no results from search) */}
                {!loading && recipes.length === 0 && searchQuery && !error && (
                    <div className="text-center py-20">

                        <svg className="mx-auto h-16 w-16 text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>

                        <h3 className="text-xl font-semibold text-primaryDark mb-2">
                            No recipes found for "{searchQuery}"
                        </h3>

                        <p className="text-muted mb-6">
                            Try a different keyword or clear your search.
                        </p>

                        <button
                            onClick={handleBrowseAll}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
                        >
                            Browse All Recipes
                        </button>

                    </div>
                )}


                {/* Recipe Grid */}
                {recipes.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {recipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>


                        {/* Load More Button */}
                        {hasMore && !loading && (
                            <div className="text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="px-8 py-3 bg-card text-primaryDark border-2 border-primary rounded-lg hover:bg-subtle transition-colors font-medium"
                                >
                                    Load More
                                </button>
                            </div>
                        )}


                        {/* Loading More State */}
                        {loading && recipes.length > 0 && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                            </div>
                        )}


                        {/* End of Results */}
                        {!hasMore && recipes.length > 0 && (
                            <div className="text-center py-8">

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


            {/* add user Recipe */}
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
