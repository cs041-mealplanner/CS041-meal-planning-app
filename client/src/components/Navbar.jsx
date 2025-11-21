export default function Header() {
    return (
        <header className="w-full bg-white shadow-sm">
            <nav className="max-w-7xl mx-auto flex items-center justify-between p-4">
                {/* Title and logo */}
                <div className="text-2xl font-bold text-blue-600">
                    Nourishly
                </div>

                {/* Navigation links */}
                <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <li><a href="/" className="hover:text-blue-600">Home</a></li>
                    <li><a href="#recipes" className="hover:text-blue-600">Recipes</a></li>
                    <li><a href="#dashboard" className="hover:text-blue-600">Dash board</a></li>
                    <li><a href="#mealplanner" className="hover:text-blue-600">Meal planner</a></li>
                </ul>

                {/* Login */}
                <button className="hidden md:block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
                    Get Started
                </button>

                {/* Mobile menu icon */}
                <div className="md:hidden text-3xl">
                    ☰
                </div>
            </nav>
        </header>
    );
}
