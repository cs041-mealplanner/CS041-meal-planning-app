import FeatureCard from "../components/FeatureCard";

export default function Home() {
    return (
        <div className="px-8 py-12 bg-main min-h-screen">

            {/* HERO SECTION */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 text-primary">Plan Your Meals With Ease</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Search recipes, save your favorites, and build your weekly meal plan effortlessly.
                </p>

                <button className="mt-6 bg-primary text-white px-6 py-3 rounded-xl text-lg hover:brightness-110 transition">
                    Get Started
                </button>
            </section>

            {/* FEATURE CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                    title="Search Recipes"
                    description="Find meals by ingredients, diet, or preferences."
                />
                <FeatureCard
                    title="Save Favorites"
                    description="Bookmark and organize recipes you love."
                />
                <FeatureCard
                    title="Weekly Meal Plan"
                    description="Automatically build a full week's meal plan."
                />
            </section>

            {/* SEARCH BAR BELOW CARDS */}
            <section className="max-w-xl mx-auto bg-white shadow rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4 text-primary">Search for a Recipe</h2>

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-primary"
                    />

                    <button className="bg-primary text-white px-4 py-2 rounded-xl hover:brightness-110 transition">
                        Search
                    </button>
                </div>
            </section>
        </div>
    );
}
