// layout-only UI pass (Figma parity). No backend wiring.

const mealsMock = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: "Grilled Chicken",
    meta: "600 kcal • Lunch",
    imageUrl: "https://placehold.co/369x307",
}));

const days = [
    { d: "3", label: "Mon" },
    { d: "4", label: "Tue" },
    { d: "5", label: "Wed" },
    { d: "6", label: "Thur" },
    { d: "7", label: "Fri" },
    { d: "8", label: "Sat" },
    { d: "9", label: "Sun" },
];

function AddMealCard({ label }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-300 bg-card px-10 py-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-subtle">
                <span className="text-3xl font-bold text-muted">+</span>
            </div>

            <div className="mt-3 text-sm font-semibold text-neutral-900">Add meal</div>
            <div className="mt-1 text-xs text-muted">{label}</div>
        </div>
    );
}

function MealCard({ meal }) {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-stone-300 bg-card"
            style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
        >
            <img
                src={meal.imageUrl}
                alt={meal.title}
                className="h-64 w-full object-cover"
            />
            <div className="p-4">
                <div className="text-lg font-bold text-neutral-700">{meal.title}</div>
                <div className="mt-1 text-sm text-neutral-500">{meal.meta}</div>
            </div>
        </div>
    );
}

function DayPill({ d, label, active }) {
    return (
        <button
            type="button"
            className={[
                "flex h-20 w-14 flex-col items-center justify-center rounded-2xl border border-stone-300",
                active ? "bg-primary text-white" : "bg-card text-neutral-500",
            ].join(" ")}
        >
            <div className="text-xl font-bold leading-4">{d}</div>
            <div className="mt-1 text-xs tracking-tight">{label}</div>
        </button>
    );
}

export default function MealPlanner() {
    return (
        <div className="min-h-screen bg-secondarybg">
            {/* HERO */}
            <section className="w-full border-b border-stone-300 bg-gradient-to-b from-mainbg to-[#FFF7ED]">
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-0 px-6 py-14 md:grid-cols-2">
                    <div className="py-2">
                        <h1 className="text-4xl font-bold leading-tight text-primaryDark md:text-5xl">
                            Plan your perfect week of meals
                        </h1>

                        <p className="mt-4 text-lg text-muted">
                            Build a plan, track calories, and generate a shopping list in seconds.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white"
                                style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                            >
                                Create My Plan
                            </button>

                            <button
                                type="button"
                                className="rounded-xl border border-primary bg-transparent px-5 py-3 text-base font-semibold text-primary"
                                style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div
                            className="w-full max-w-md overflow-hidden rounded-3xl bg-card"
                            style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                        >
                            <img
                                src="https://placehold.co/493x403"
                                alt="Meal"
                                className="h-80 w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* BUILD MEAL PLAN CARD */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4">
                <div
                    className="rounded-3xl bg-card px-6 py-10 md:px-10"
                    style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                >
                    <h2 className="text-center text-3xl font-bold text-neutral-700">
                        🍴 Build Your Meal Plan
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <AddMealCard label="Breakfast" />
                        <AddMealCard label="Lunch" />
                        <AddMealCard label="Dinner" />
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            className="rounded-xl bg-stone-200 px-5 py-3 text-sm font-semibold text-primaryDark"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            type="button"
                            className="rounded-xl border border-primaryDark bg-primary px-5 py-3 text-sm font-semibold text-white"
                            style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                        >
                            Create My Plan
                        </button>

                        <button
                            type="button"
                            className="rounded-xl border border-primary bg-transparent px-5 py-3 text-sm font-semibold text-primary"
                            style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                        >
                            Save Plan
                        </button>
                    </div>
                </div>
            </section>

            {/* WEEK SELECTOR */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4">
                <div className="mx-auto w-full max-w-xl rounded-2xl bg-subtle px-6 py-5">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="h-6 w-7 rounded-lg border border-stone-300 bg-card text-xs text-neutral-500"
                        >
                            {"<"}
                        </button>

                        <div className="text-center text-3xl font-semibold text-neutral-500">
                            November 3-9
                        </div>

                        <button
                            type="button"
                            className="h-6 w-7 rounded-lg border border-stone-300 bg-card text-xs text-neutral-500"
                        >
                            {">"}
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        {days.map((x) => (
                            <DayPill
                                key={x.d}
                                d={x.d}
                                label={x.label}
                                active={x.d === "9"}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* MEALS GRID */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4 pb-14">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {mealsMock.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                    ))}
                </div>
            </section>

            {/* FOOTER TEMPORARY */}
            <footer className="mt-10 bg-headerbg py-10">
                <div className="mx-auto max-w-6xl px-4 text-center text-sm font-normal text-neutral-500">
                    © Nourishly 2025 • Privacy • Terms
                </div>
            </footer>
        </div>
    );
}
