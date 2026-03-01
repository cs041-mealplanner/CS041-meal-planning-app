import FeatureCard from "../components/FeatureCard";

export default function Home() {
    return (
        <div className="min-h-screen bg-secondarybg">
            <div className="mx-auto max-w-6xl px-6 py-12">
                {/* HERO */}
                <section className="mb-12 overflow-hidden rounded-2xl border border-stone-300 bg-mainbg shadow-[0px_8px_24px_0px_rgba(20,30,25,0.08)]">
                    <div className="px-8 py-12">
                        <h1 className="text-4xl font-bold leading-tight text-primaryDark">
                            Plan your meals with ease
                        </h1>
                        <p className="mt-4 max-w-2xl text-lg text-muted">
                            Search recipes, save your favorites, and build your weekly meal plan effortlessly.
                        </p>

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow hover:brightness-110 transition"
                            >
                                Get Started
                            </button>
                            <button
                                type="button"
                                className="rounded-xl border border-primary bg-transparent px-6 py-3 text-base font-semibold text-primary shadow hover:brightness-110 transition"
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>
                </section>

                {/* FEATURE CARDS */}
                <section className="mb-10 grid grid-cols-3 gap-6">
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
                        description="Build a plan for the week with a few clicks."
                    />
                </section>

                {/* SEARCH */}
                <section className="rounded-2xl border border-stone-300 bg-card p-6 shadow-[0px_8px_24px_0px_rgba(20,30,25,0.08)]">
                    <h2 className="text-xl font-semibold text-primaryDark">
                        Search for a recipe
                    </h2>

                    <div className="mt-4 flex items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            className="w-full rounded-xl border border-stone-300 bg-subtle px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                            type="button"
                            className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:brightness-110 transition"
                        >
                            Search
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
