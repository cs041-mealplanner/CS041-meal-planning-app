import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';

const FILTER_TAGS = ['All', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb'];
const RECIPES_PER_PAGE = 16;
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const API_BASE = 'https://api.spoonacular.com/recipes';

export default function Recipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    // fetch recipes from Spoonacular API
    const fetchRecipes = async (reset = false) => {
        if (!API_KEY) {
            console.error('Spoonacular API key not configured.');
            setError('Unable to load recipes. Please try again later.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const currentOffset = reset ? 0 : offset;
            let url = `${API_BASE}/complexSearch?apiKey=${API_KEY}&number=${RECIPES_PER_PAGE}&offset=${currentOffset}&addRecipeNutrition=true&fillIngredients=true`;

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

            if (reset) {
                setRecipes(data.results);
                setOffset(RECIPES_PER_PAGE);
            } else {
                setRecipes(prev => [...prev, ...data.results]);
                setOffset(prev => prev + RECIPES_PER_PAGE);
            }

            setTotalResults(data.totalResults);
            setHasMore(data.results.length === RECIPES_PER_PAGE && (reset ? RECIPES_PER_PAGE : offset + RECIPES_PER_PAGE) < Math.min(data.totalResults, 100));

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // load and when filter changes
    useEffect(() => {
        setRecipes([]);
        setOffset(0);
        setHasMore(true);
        fetchRecipes(true);
    }, [activeFilter, searchQuery]);


    // handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };


    // handle filter change
    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    // handle load more
    const handleLoadMore = () => {
        fetchRecipes(false);
    };


    // handle browse all (reset search and filter)
    const handleBrowseAll = () => {
        setSearchInput('');
        setSearchQuery('');
        setActiveFilter('All');
    };


    return (
        <div className="min-h-screen bg-mainbg">
            <div className="max-w-7xl mx-auto px-6 py-12">

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
                            onClick={() => fetchRecipes(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}


                {/* Loading State (Initial) */}
                {loading && recipes.length === 0 && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    </div>
                )}


                {/* Empty State (No Results from Search) */}
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
                        {hasMore && !loading && totalResults <= 100 && (
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
                                    That's everything! Try adjusting your filters to see more recipes.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
