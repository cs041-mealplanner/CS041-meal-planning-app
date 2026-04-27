import { useEffect, useState } from "react";

const REPO_URL = "https://github.com/cs041-mealplanner/CS041-meal-planning-app";
const ISSUES_URL = "https://github.com/cs041-mealplanner/CS041-meal-planning-app/issues";

const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#in-the-app", label: "In the App" },
    { href: "#access", label: "Access" },
    { href: "#team-feedback", label: "Team" },
    { href: REPO_URL, label: "GitHub", external: true },
];

const highlights = [
    {
        title: "Plan the week in one place",
        description:
            "Set breakfast, lunch, and dinner for the week without juggling notes, tabs, and reminders.",
    },
    {
        title: "Browse recipes by preference",
        description:
            "Search by name and filter by tags like Vegetarian, Vegan, High Protein, and Low Carb.",
    },
    {
        title: "Save custom recipes",
        description:
            "Add personal recipes to the app so your own staples can live beside the built-in recipe library.",
    },
    {
        title: "Build a grocery list from your plan",
        description:
            "Turn saved meals into a practical shopping list with grouped items and progress tracking.",
    },
];

const screenshotCards = [
    {
        title: "Weekly meal planner",
        caption: "Build breakfast, lunch, and dinner plans from one weekly view.",
        image: "./screenshots/meal-planner.png",
        alt: "Meal planner page showing breakfast, lunch, dinner cards and a weekly date selector.",
        featured: true,
    },
    {
        title: "Recipe browsing",
        caption: "Search, filter, and compare recipe options before adding them to your plan.",
        image: "./screenshots/recipes.png",
        alt: "Recipes page showing a search bar, dietary filters, and recipe cards.",
    },
    {
        title: "Grocery list",
        caption: "Keep shopping organized with grouped items and progress tracking.",
        image: "./screenshots/grocery-list.png",
        alt: "Grocery list page showing categorized grocery items with progress indicators.",
    },
];

const teamMembers = [
    "Che-Han Hsu",
    "Lapatrada Liawpairoj",
    "Kyle Lund",
    "Xander Sniffen",
    "Louie Baobao",
];

const heroHighlights = [
    {
        title: "Weekly plans",
        detail: "Breakfast, lunch, and dinner in one view",
    },
    {
        title: "Recipe search",
        detail: "Filter and compare meal options quickly",
    },
    {
        title: "Smart grocery lists",
        detail: "Turn planned meals into shopping steps",
    },
];

export default function LandingPage() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        function handleScroll() {
            setShowBackToTop(window.scrollY > 720);
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    return (
        <div className="bg-headerbg text-primaryDark">
            <header className="sticky top-0 z-20 border-b border-stone-300 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
                    <a href="#" className="text-2xl font-bold text-primary">
                        <span className="flex items-center gap-3">
                            <img
                                src="./logo/nourishlylogonoears.png"
                                alt="Nourishly logo"
                                className="h-10 w-auto"
                            />
                            <span>Nourishly</span>
                        </span>
                    </a>

                    <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noreferrer" : undefined}
                                className="transition hover:text-primaryDark"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </header>

            <section className="relative overflow-hidden border-b border-stone-300 bg-mainbg/65">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-55"
                    style={{
                        background:
                            "radial-gradient(circle at 14% 22%, rgba(239,229,214,0.9), transparent 28%), radial-gradient(circle at 82% 28%, rgba(107,142,117,0.1), transparent 22%), linear-gradient(180deg, #fbf8f2 0%, #f4ecdf 100%)",
                    }}
                />

                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
                    <div
                        className="rounded-[2rem] border border-stone-200 bg-white p-8"
                        style={{ boxShadow: "0 16px 36px rgba(20,30,25,0.08)" }}
                    >
                        <h1 className="max-w-4xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                            Nourishly is a meal-planning web app for people who
                            want meals, recipes, and grocery planning in one
                            place.
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                            It helps users move from deciding what to cook to
                            building a usable shopping list without bouncing
                            across multiple tools.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#access"
                                className="rounded-2xl bg-primary px-6 py-3.5 text-center text-base font-semibold text-white transition hover:bg-primaryDark"
                                style={{ boxShadow: "0 14px 30px rgba(20,30,25,0.12)" }}
                            >
                                How to Access
                            </a>

                            <a
                                href={REPO_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl border border-primary bg-white px-6 py-3.5 text-center text-base font-semibold text-primary transition hover:bg-subtle"
                            >
                                View on GitHub
                            </a>
                        </div>

                        <div className="mt-10 grid gap-4 sm:grid-cols-3">
                            {heroHighlights.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-stone-200 bg-subtle/55 p-4"
                                    style={{ boxShadow: "0 12px 26px rgba(20,30,25,0.08)" }}
                                >
                                    <div className="text-sm font-semibold text-primaryDark">
                                        {item.title}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-muted">
                                        {item.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div
                            className="block w-full max-w-3xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-3"
                            style={{ boxShadow: "0 18px 40px rgba(20,30,25,0.14)" }}
                        >
                            <div className="h-[25rem] overflow-hidden rounded-[1.35rem] md:h-[30rem] lg:h-[34rem]">
                                <img
                                    src="./screenshots/meal-planner.png"
                                    alt="Nourishly meal planner interface preview."
                                    className="h-full w-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="bg-subtle/80 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div
                        className="rounded-[2rem] border border-stone-300 bg-white p-8"
                        style={{ boxShadow: "0 16px 32px rgba(20,30,25,0.08)" }}
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                                    Key features
                                </p>
                                <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                                    What Nourishly helps users do
                                </h2>
                            </div>

                            <p className="max-w-2xl text-base leading-7 text-muted">
                                The focus is simple: reduce meal-planning friction and
                                make it easier to follow through.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        {highlights.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-[1.75rem] border border-stone-300 bg-white p-7"
                                style={{ boxShadow: "0 14px 30px rgba(20,30,25,0.08)" }}
                            >
                                <h3 className="text-2xl font-semibold leading-tight text-primaryDark">
                                    {item.title}
                                </h3>

                                <p className="mt-4 text-base leading-7 text-muted">
                                    {item.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="in-the-app" className="border-y border-stone-300 bg-white py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="px-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            In the app
                        </p>
                        <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                            A quick look at the product
                        </h2>
                    </div>

                    <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
                        {screenshotCards.map((shot) => (
                            <article
                                key={shot.title}
                                className={[
                                    "self-start overflow-hidden rounded-[1.8rem] border border-stone-300 bg-white",
                                    shot.featured ? "lg:col-span-2" : "",
                                ].join(" ")}
                                style={{ boxShadow: "0 16px 32px rgba(20,30,25,0.08)" }}
                            >
                                <div className={shot.featured ? "aspect-[16/10] overflow-hidden" : "aspect-[4/3] overflow-hidden"}>
                                    <img
                                        src={shot.image}
                                        alt={shot.alt}
                                        className="h-full w-full object-cover object-top"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-primaryDark">
                                        {shot.title}
                                    </h3>

                                    <p className="mt-2 text-base leading-7 text-muted">
                                        {shot.caption}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="access" className="bg-mainbg/65 py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <article
                        className="rounded-[1.8rem] border border-stone-300 bg-white p-8"
                        style={{ boxShadow: "0 16px 32px rgba(20,30,25,0.08)" }}
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Access
                        </p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight text-primaryDark md:text-4xl">
                            Try the app or explore the code.
                        </h2>

                        <p className="mt-5 max-w-3xl text-base leading-7 text-muted">
                            Start with the repository for setup details, screenshots,
                            and collaboration. If the team publishes a live app link,
                            this section is the right place to swap that in.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={REPO_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl bg-primary px-5 py-3 text-center font-semibold text-white transition hover:bg-primaryDark"
                            >
                                View source
                            </a>

                            <a
                                href={ISSUES_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-2xl border border-primary px-5 py-3 text-center font-semibold text-primary transition hover:bg-subtle"
                            >
                                Open GitHub Issues
                            </a>
                        </div>

                        <div className="mt-6 space-y-2 text-sm leading-6 text-muted">
                            <p>Local setup: Node.js 20.x and Git</p>
                            <p>Run `npm ci`, then `npm run dev:client` for the main app</p>
                        </div>
                    </article>
                </div>
            </section>

            <section id="team-feedback" className="bg-headerbg py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <article
                        className="rounded-[1.8rem] border border-stone-300 bg-white p-8"
                        style={{ boxShadow: "0 16px 32px rgba(20,30,25,0.08)" }}
                    >
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                            Team and feedback
                        </p>

                        <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                            Built by the Nourishly capstone team.
                        </h2>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map((member) => (
                                <div
                                    key={member}
                                    className="rounded-2xl border border-stone-200 bg-subtle px-4 py-4"
                                >
                                    <div className="font-semibold text-primaryDark">
                                        {member}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-sm leading-6 text-muted">
                            Project partner: Alexander Ulbrich
                        </p>

                        <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
                            Questions, bug reports, and feedback can be shared
                            through the project issue tracker.
                        </p>
                    </article>
                </div>
            </section>

            {showBackToTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-primaryDark sm:bottom-6 sm:right-6 sm:px-6"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 19V5m0 0-5 5m5-5 5 5"
                        />
                    </svg>
                    Back to top
                </button>
            )}
        </div>
    );
}
