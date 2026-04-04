import { Link } from "react-router-dom";
const logoUrl = new URL("../../assets/images/nourishlylogonoears.png", import.meta.url).href;

export default function Header() {
    const isLoggedIn = false; // TODO: replace with actual auth state

    return (
        <header className="relative z-20 w-full border-b border-stone-300 bg-headerbg shadow-nav">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Title and logo */}
                <Link to="/" className="flex items-center gap-3">
                    <img
                        src={logoUrl}
                        alt="Nourishly logo"
                        className="h-[46px] w-[46px] shrink-0"
                    />
                    <div className="text-3xl font-semibold leading-none text-primary">
                        Nourishly
                    </div>
                </Link>

                {/* Navigation links */}
                <ul className="hidden items-center gap-10 text-lg font-medium text-muted md:flex">
                    <li>
                        <Link to="/dashboard" className="hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/meal-planner" className="hover:text-primary transition-colors">
                            Meal Planner
                        </Link>
                    </li>
                    <li>
                        <Link to="/recipes" className="hover:text-primary transition-colors">
                            Recipes
                        </Link>
                    </li>
                </ul>

                {isLoggedIn ? (
                    <button className="hidden rounded-xl border border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white md:block">
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="hidden rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow transition hover:brightness-110 md:block"
                    >
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}
