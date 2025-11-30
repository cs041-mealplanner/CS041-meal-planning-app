import { Link } from "react-router-dom";
export default function Header() {
    return (
        <header className="w-full bg-headerbg shadow-lg">
            <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
                {/* Title and logo */}
                <div className="text-2xl font-bold text-primary">
                    Nourishly
                </div>

                {/* Navigation links */}
                <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                    <li><Link to="#recipes" className="hover:text-blue-600">Recipes</Link></li>
                    <li><Link to="/dashboard" className="hover:text-blue-600">Dash board</Link></li>
                    <li><Link to="/mealplanner" className="hover:text-blue-600">Meal planner</Link></li>
                </ul>

                {/* Login */}
                <button className="hidden md:block bg-primary text-white px-5 py-2 rounded-lg hover:brightness-110 transition">
                    Get Started
                </button>

                {/* Mobile menu icon */}
                <div className="md:hidden text-3xl text-primary">
                    ☰
                </div>
            </nav>
        </header>
    );
}
