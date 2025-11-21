import FeatureCard from "../components/FeatureCard";
export default function MealPlanner() {
    return (
        <div className="px-8 py-12">
            {/* HERO SECTION */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Your Personalized Meal Planner</h1>
                <p className="text-gray-600 max-w-xl mx-auto">
                    Create and manage your weekly meal plans with ease. Save your favorite recipes and organize them into a plan that fits your lifestyle.
                </p>
                <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-green-700">
                    Start Planning
                </button>
            </section>
            {/* FEATURE CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <FeatureCard
                    title="Custom Meal Plans"
                    description="Tailor your meal plans to your dietary needs and preferences."
                />
                <FeatureCard
                    title="Recipe Library"
                    description="Access a vast collection of recipes to choose from."
                />
                <FeatureCard
                    title="Shopping Lists"
                    description="Generate shopping lists based on your meal plans."
                />
            </section>
            {/* SEARCH BAR BELOW CARDS */}
            <section className="max-w-xl mx-auto bg-white shadow rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Find Recipes for Your Plan</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-green-300"
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
                        Search
                    </button>
                </div>
            </section>
        </div>
    );
}