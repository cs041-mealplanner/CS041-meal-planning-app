import { Link } from "react-router-dom";
const logoUrl = new URL("../../assets/images/nourishlylogonoears.png", import.meta.url).href;

export default function Header() {
    return (
        <header className="w-full border-b border-stone-300 bg-headerbg shadow-nav">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Title and logo (placeholder: text only) */}
                <div className="flex items-center gap-3">
                    <img
                        src={logoUrl}
                        alt="Nourishly logo"
                        className="h-10 w-10 shrink-0"
                    />
                    <div className="text-3xl font-semibold leading-none text-primary">
                        Nourishly
                    </div>
                </div>

                {/* Navigation links */}
                <ul className="hidden items-center gap-10 text-lg font-medium text-muted md:flex">
                    <li>
                        <Link to="/" className="hover:text-primary transition-colors">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/mealplanner" className="hover:text-primary transition-colors">
                            Meal Planner
                        </Link>
                    </li>
                    <li>
                        <Link to="#recipes" className="hover:text-primary transition-colors">
                            Recipes
                        </Link>
                    </li>
                </ul>

                {/* call to action */}
                <button className="hidden rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow hover:brightness-110 transition md:block">
                    Get Started
                </button>
            </nav>
        </header>
    );
}
