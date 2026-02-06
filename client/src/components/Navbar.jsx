import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <header className="w-full bg-headerbg shadow-lg">
            <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
                {/* Title and logo */}
                <Link to="/" className="text-2xl font-bold text-primary">
                    Nourishly
                </Link>

                {/* Navigation links */}
                <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <li>
                        <Link to="/" className="hover:text-primary transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="#recipes" className="hover:text-primary transition">
                            Recipes
                        </Link>
                    </li>
                    {isAuthenticated && (
                        <>
                            <li>
                                <Link to="/dashboard" className="hover:text-primary transition">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/mealplanner"
                                    className="hover:text-primary transition"
                                >
                                    Meal planner
                                </Link>
                            </li>
                        </>
                    )}
                </ul>

                {/* Auth buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-600 text-sm">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-primary font-medium hover:underline"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-primary text-white px-5 py-2 rounded-lg hover:brightness-110 transition"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile menu icon */}
                <button
                    className="md:hidden text-3xl text-primary"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? "✕" : "☰"}
                </button>
            </nav>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <ul className="flex flex-col p-4 space-y-4">
                        <li>
                            <Link
                                to="/"
                                className="block hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#recipes"
                                className="block hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Recipes
                            </Link>
                        </li>
                        {isAuthenticated && (
                            <>
                                <li>
                                    <Link
                                        to="/dashboard"
                                        className="block hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/mealplanner"
                                        className="block hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Meal planner
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className="border-t pt-4">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                                >
                                    Logout ({user?.email})
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        className="block text-center text-primary font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block text-center bg-primary text-white px-5 py-2 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
}
