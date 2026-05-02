import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const previewCards = [
    { title: "Grilled Chicken Bowl", meta: "430 kcal · Balanced", emoji: "🍗", bg: "bg-[#EADBBC]" },
    { title: "Garden Caesar Salad", meta: "320 kcal · Fresh", emoji: "🥗", bg: "bg-[#DCE8D7]" },
    { title: "Eggs & Toast", meta: "280 kcal · Quick", emoji: "🍳", bg: "bg-[#DCE7F2]" },
];

const features = [
    {
        icon: "🗓️",
        title: "Plan Your Week",
        description: "Assign meals to your weekly calendar so every day has a simple plan.",
    },
    {
        icon: "🍽️",
        title: "Browse Recipes",
        description: "Search and filter recipes by dietary preferences like vegan, vegetarian, high protein, and low carb.",
    },
    {
        icon: "🛒",
        title: "Auto Grocery List",
        description: "Turn saved meals into a grocery list so shopping feels less chaotic.",
    },
];

export default function Landing() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-lg text-muted">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-mainbg text-primaryDark">
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="text-center lg:text-left">
                        <div className="mx-auto mb-4 inline-flex rounded-full bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm lg:mx-0">
                            🌿 Smart meal planning, made simple
                        </div>

                        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-primaryDark sm:text-5xl lg:mx-0 lg:text-6xl">
                            Plan your perfect week of meals
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg lg:mx-0">
                            Build a meal plan, discover recipes you love, and generate your grocery list — all in one place.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-sm transition-colors hover:bg-primaryDark"
                            >
                                Get Started
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="rounded-2xl border-2 border-primary bg-card px-8 py-4 font-bold text-primary transition-colors hover:bg-subtle"
                            >
                                Browse Recipes
                            </button>
                        </div>

                        <div className="mt-4 text-sm text-muted">
                            Free to use · No credit card required
                        </div>
                    </div>

                    <div className="rounded-3xl bg-card p-4 shadow-sm sm:p-5 lg:p-6">
                        <div className="rounded-3xl bg-subtle p-5">
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-semibold text-muted">This week</div>
                                    <div className="text-2xl font-bold text-primaryDark">Meal snapshot</div>
                                </div>
                                <div className="rounded-full bg-card px-3 py-1 text-sm font-bold text-primary">7 days</div>
                            </div>

                            <div className="space-y-3">
                                {previewCards.map((card) => (
                                    <div key={card.title} className="flex items-center gap-4 rounded-2xl bg-card p-3 shadow-sm">
                                        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl ${card.bg}`}>
                                            {card.emoji}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="truncate font-bold text-primaryDark">{card.title}</div>
                                            <div className="mt-1 text-sm text-muted">{card.meta}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {previewCards.map((card) => (
                        <div key={card.title} className="overflow-hidden rounded-3xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                            <div className={`flex h-44 items-center justify-center text-5xl ${card.bg}`}>
                                {card.emoji}
                            </div>
                            <div className="p-5 text-left">
                                <div className="text-lg font-bold text-primaryDark">{card.title}</div>
                                <div className="mt-1 text-sm text-muted">{card.meta}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-card py-16 sm:py-20">
                <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        Why Nourishly
                    </div>

                    <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight text-primaryDark sm:text-4xl lg:text-5xl">
                        Everything you need for smarter meals
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.title} className="rounded-3xl bg-mainbg p-6 text-left shadow-sm sm:p-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-2xl">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-5 text-xl font-bold text-primaryDark">{feature.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-primary py-16 text-center text-white sm:py-20">
                <div className="mx-auto max-w-3xl px-4 sm:px-6">
                    <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                        Ready to start eating better?
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm text-white/85 sm:text-base">
                        Join Nourishly and take the stress out of meal planning — for good.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="mt-8 rounded-2xl bg-white px-8 py-4 font-bold text-primaryDark transition hover:bg-subtle"
                    >
                        Get Started
                    </button>
                </div>
            </section>
        </div>
    );
}
