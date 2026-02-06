import ListsPanel from "../components/ListsPanel";
import WeeklyCalendar from "../components/WeeklyCalendar";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10">
            {/* Welcome */}
            <div>
                <h1 className="text-3xl font-bold">
                    Welcome Back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
                </h1>
                <p className="text-gray-600">
                    New day, new meals — nourish your body and mind.
                </p>
            </div>

            {/* Calendar */}
            <WeeklyCalendar />

            {/* Lists + Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListsPanel />

                <div className="bg-gradient-to-br from-[#6B8E6F] to-[#4A6B4E] rounded-xl shadow-md flex items-center justify-center h-80">
                    <p className="text-white text-lg font-medium">Your Meal Inspiration</p>
                </div>
            </div>

            {/* Meals for Today placeholder */}
            <div>
                <h2 className="text-2xl font-semibold mb-4">Meals for Today</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center mb-2">
                            <span className="text-gray-400">🍽️</span>
                        </div>
                        <p className="font-semibold">Breakfast</p>
                        <p className="text-sm text-gray-500">No meal planned</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center mb-2">
                            <span className="text-gray-400">🍽️</span>
                        </div>
                        <p className="font-semibold">Lunch</p>
                        <p className="text-sm text-gray-500">No meal planned</p>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                        <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center mb-2">
                            <span className="text-gray-400">🍽️</span>
                        </div>
                        <p className="font-semibold">Dinner</p>
                        <p className="text-sm text-gray-500">No meal planned</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
