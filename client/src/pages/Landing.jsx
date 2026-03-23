import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="bg-mainbg text-primaryDark">
            {/* HERO */}
            <section className="mx-auto max-w-6xl px-6 py-16 text-center">
                <div className="text-xs font-semibold tracking-wide text-muted">
                    🌿 Smart meal planning, made simple
                </div>

                <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
                    Plan your perfect
                    <br />
                    week of meals
                </h1>

                <p className="mx-auto mt-6 max-w-2xl text-base text-muted md:text-lg">
                    Build a meal plan, discover recipes you love, and generate
                    your grocery list — all in one place.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/sign-up")}
                    className="mt-8 rounded-xl bg-primary px-8 py-3 text-base font-semibold text-white"
                    style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                >
                    Get Started
                </button>

                <div className="mt-4 text-xs text-neutral-400">
                    Free to use · No credit card required
                </div>
            </section>

            {/* PREVIEW CARDS */}
            <section className="mx-auto max-w-6xl px-6 pb-16">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                        <div className="flex h-44 items-center justify-center bg-[#EADBBC] text-5xl">
                            🍗
                        </div>
                        <div className="p-4 text-left">
                            <div className="text-lg font-bold text-neutral-800">
                                Grilled Chicken Bowl
                            </div>
                            <div className="mt-1 text-sm text-neutral-500">
                                430 kcal · Lunch
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                        <div className="flex h-44 items-center justify-center bg-[#DCE8D7] text-5xl">
                            🥗
                        </div>
                        <div className="p-4 text-left">
                            <div className="text-lg font-bold text-neutral-800">
                                Caesar Salad
                            </div>
                            <div className="mt-1 text-sm text-neutral-500">
                                320 kcal · Lunch
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
                        <div className="flex h-44 items-center justify-center bg-[#DCE7F2] text-5xl">
                            🍳
                        </div>
                        <div className="p-4 text-left">
                            <div className="text-lg font-bold text-neutral-800">
                                Eggs &amp; Toast
                            </div>
                            <div className="mt-1 text-sm text-neutral-500">
                                280 kcal · Breakfast
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section className="bg-card py-20">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Why Nourishly
                    </div>

                    <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
                        Everything you need for
                        <br />
                        smarter meals
                    </h2>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-2xl bg-[#F2EEE6] p-8 text-left shadow-sm">
                            <div className="text-2xl">🗓️</div>
                            <h3 className="mt-5 text-xl font-bold text-neutral-800">
                                Plan Your Week
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-neutral-500">
                                Assign breakfast, lunch, and dinner to every day
                                of the week. Stay organized and stop wondering
                                what to eat.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F2EEE6] p-8 text-left shadow-sm">
                            <div className="text-2xl">🍽️</div>
                            <h3 className="mt-5 text-xl font-bold text-neutral-800">
                                Browse Recipes
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-neutral-500">
                                Discover new dishes filtered by meal type and
                                dietary preference. Add any recipe to your plan
                                in one tap.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#F2EEE6] p-8 text-left shadow-sm">
                            <div className="text-2xl">🛒</div>
                            <h3 className="mt-5 text-xl font-bold text-neutral-800">
                                Auto Grocery List
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-neutral-500">
                                Your grocery list builds itself as you plan. No
                                more forgetting ingredients — just shop and
                                cook.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="bg-primary py-20 text-center text-white mb-0">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                        Ready to start eating
                        <br />
                        better?
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-sm text-white/80 md:text-base">
                        Join Nourishly and take the stress out of meal
                        planning — for good.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/sign-up")}
                        className="mt-8 rounded-xl bg-white px-8 py-3 text-base font-semibold text-primaryDark"
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
}