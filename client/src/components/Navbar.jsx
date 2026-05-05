import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const logoUrl = new URL("../../assets/images/nourishlylogonoears.png", import.meta.url).href;

export default function Header() {
    const { isAuthenticated, isLoading, logout } = useAuth();
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
            <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 md:px-8">
                {/* Mobile centered brand / Desktop left brand */}
                <Link
                    to={logoTarget}
                    onClick={handleLinkClick}
                    className="mx-auto flex items-center gap-3 md:mx-0"
                >
                    <img
                        src={logoUrl}
                        alt="Nourishly logo"
                        className="h-[48px] w-[48px] shrink-0 sm:h-[54px] sm:w-[54px] md:h-[46px] md:w-[46px]"
                    />

                    <div className="text-3xl font-semibold leading-none text-primary sm:text-4xl md:text-3xl">
                        Nourishly
                    </div>
                </Link>

                {/* Desktop Navigation links */}
                {isAuthenticated && !isLoading ? (
                    <ul className="ml-auto hidden items-center gap-8 text-lg font-medium text-muted md:flex lg:gap-10">
                        <li>
                            <Link to="/dashboard" className="transition-colors hover:text-primary">
                                Dashboard
                            </Link>
                        </li>

                        <li>
                            <Link to="/meal-planner" className="transition-colors hover:text-primary">
                                Meal Planner
                            </Link>
                        </li>

                        <li>
                            <Link to="/recipes" className="transition-colors hover:text-primary">
                                Recipes
                            </Link>
                        </li>

                        <li>
                            <Link to="/grocery" className="transition-colors hover:text-primary">
                                Grocery List
                            </Link>
                        </li>
                    </ul>
                ) : (
                    <div className="hidden md:block md:flex-1" />
                )}

                {/* Desktop Auth button */}
                {isAuthenticated && !isLoading ? (
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="ml-8 hidden rounded-xl border border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-white md:block"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="ml-8 hidden rounded-xl bg-primary px-5 py-2 font-semibold text-white shadow transition hover:brightness-110 md:block"
                    >
                        Login
                    </Link>
                )}

                {/* Mobile hamburger button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-1.5 rounded-lg p-2 md:hidden"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <span className={`h-0.5 w-7 bg-primary transition-all ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                    <span className={`h-0.5 w-7 bg-primary transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`h-0.5 w-7 bg-primary transition-all ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
                </button>
            </nav>

            {/* Mobile dropdown */}
            {mobileMenuOpen && (
                <div className="border-t border-stone-300 bg-headerbg md:hidden">
                    {isAuthenticated && !isLoading ? (
                        <div className="flex flex-col px-6 py-4">
                            <Link
                                to="/dashboard"
                                onClick={handleLinkClick}
                                className="rounded-xl px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-subtle hover:text-primary"
                            >
                                Dashboard
                            </Link>

                            <Link
                                to="/meal-planner"
                                onClick={handleLinkClick}
                                className="rounded-xl px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-subtle hover:text-primary"
                            >
                                Meal Planner
                            </Link>

                            <Link
                                to="/recipes"
                                onClick={handleLinkClick}
                                className="rounded-xl px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-subtle hover:text-primary"
                            >
                                Recipes
                            </Link>

                            <Link
                                to="/grocery"
                                onClick={handleLinkClick}
                                className="rounded-xl px-3 py-3 text-lg font-medium text-muted transition-colors hover:bg-subtle hover:text-primary"
                            >
                                Grocery List
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="mt-4 rounded-xl border border-primary px-5 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col px-6 py-4">
                            <Link
                                to="/login"
                                onClick={handleLinkClick}
                                className="rounded-xl bg-primary px-5 py-3 text-center font-semibold text-white shadow transition hover:brightness-110"
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
