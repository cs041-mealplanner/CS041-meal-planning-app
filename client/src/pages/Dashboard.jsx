import ListsPanel from "../components/ListsPanel";
import WeeklyCalendar from "../components/WeeklyCalendar";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto p-6 space-y-10">

            {/* Welcome */}
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-gray-600">
                New day, new meals — nourish your body and mind.
            </p>

            {/* Calendar */}
            <WeeklyCalendar />

            {/* Lists + Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ListsPanel />

                <img
                    /*src="/sample-food.jpg" */
                    alt="Meal"
                    className="rounded-xl shadow-md object-cover w-full h-80"
                />
            </div>

            {/* Meals for Today placeholder */}
            <h2 className="text-2xl font-semibold">Meals for Today</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow p-4">
                    {/*<img src="/grilled.jpg" className="rounded-lg" />*/}

                    <p className="font-semibold mt-2">Grilled Chicken</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    {/*<img src="/grilled.jpg" className="rounded-lg" />*/}
                    <p className="font-semibold mt-2">Grilled Chicken</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    {/*<img src="/grilled.jpg" className="rounded-lg" /> */}
                    <p className="font-semibold mt-2">Grilled Chicken</p>
                </div>
            </div>
        </div>
    );
}
