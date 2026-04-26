import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
const logoUrl = new URL("../../assets/images/nourishlylogonoears.png", import.meta.url).href;


export default function Header() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const logoTarget = isAuthenticated ? "/dashboard" : "/";

    async function handleLogout() {
        await logout();
        navigate("/", { replace: true });
        setMobileMenuOpen(false);
    }


    function handleLinkClick() {
        setMobileMenuOpen(false);
    }


    return (
        <header className="relative z-20 w-full border-b border-stone-300 bg-headerbg shadow-nav">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <Link to={logoTarget} className="flex items-center gap-3">

                    <img
                        src={logoUrl}
                        alt="Nourishly logo"
                        className="h-[46px] w-[46px] shrink-0"
                    />

                    <div className="text-3xl font-semibold leading-none text-primary">
                        Nourishly
                    </div>

                </Link>


                {/* Desktop Navigation links */}
                {isAuthenticated && !isLoading ? (
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

                        <li>
                            <Link to="/grocery" className="hover:text-primary transition-colors">
                                Grocery List
                            </Link>
                        </li>

                    </ul>
                ) : (
                    <div className="hidden md:block" />
                )}


                {/* Desktop Auth button */}
                {isAuthenticated && !isLoading ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="hidden rounded-xl border border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white md:block"
                    >
                        Logout
                    </button>

                ) : (
                    <Link
                        to="/login"
                        state={{ from: location }}
                        className="hidden rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow transition hover:brightness-110 md:block"
                    >
                        Login
                    </Link>
                )}


                {/* mobile hamburger button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex flex-col gap-1.5 md:hidden"
                    aria-label="Toggle menu"
                >
                    <span className={`h-0.5 w-6 bg-primary transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`h-0.5 w-6 bg-primary transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                    <span className={`h-0.5 w-6 bg-primary transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </nav>


            {/* mobile screen size menu dropdown */}
            {mobileMenuOpen && (
                <div className="border-t border-stone-300 bg-headerbg md:hidden">

                    {isAuthenticated && !isLoading ? (
                        <div className="flex flex-col px-6 py-4">

                            <Link
                                to="/dashboard"
                                onClick={handleLinkClick}
                                className="py-3 text-lg font-medium text-muted hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/meal-planner"
                                onClick={handleLinkClick}
                                className="py-3 text-lg font-medium text-muted hover:text-primary transition-colors"
                            >
                                Meal Planner
                            </Link>

                            <Link
                                to="/recipes"
                                onClick={handleLinkClick}
                                className="py-3 text-lg font-medium text-muted hover:text-primary transition-colors"
                            >
                                Recipes
                            </Link>

                            <Link
                                to="/grocery"
                                onClick={handleLinkClick}
                                className="py-3 text-lg font-medium text-muted hover:text-primary transition-colors"
                            >
                                Grocery List
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-4 rounded-xl border border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white"
                            >
                                Logout
                            </button>

                        </div>

                    ) : (
                        <div className="flex flex-col px-6 py-4">
                            <Link
                                to="/login"
                                state={{ from: location }}
                                onClick={handleLinkClick}
                                className="rounded-xl bg-primary px-5 py-2 font-semibold text-white text-center shadow transition hover:brightness-110"
                            >
                                Login
                            </Link>

                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
