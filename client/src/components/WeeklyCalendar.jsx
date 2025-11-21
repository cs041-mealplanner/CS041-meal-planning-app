import dayjs from "dayjs";
import { useState } from "react";

export default function WeeklyCalendar() {
    const [currentWeekStart, setCurrentWeekStart] = useState(
        dayjs().startOf("week") // Sunday
    );

    const days = [...Array(7)].map((_, i) =>
        currentWeekStart.add(i, "day")
    );

    const today = dayjs().format("YYYY-MM-DD");

    const nextWeek = () => {
        setCurrentWeekStart(prev => prev.add(1, "week"));
    };

    const prevWeek = () => {
        setCurrentWeekStart(prev => prev.subtract(1, "week"));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md w-full">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevWeek}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    ←
                </button>

                <h2 className="text-xl font-bold">
                    {currentWeekStart.format("MMMM")} {currentWeekStart.format("YYYY")}
                </h2>

                <button
                    onClick={nextWeek}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                    →
                </button>
            </div>

            {/* Week row */}
            <div className="grid grid-cols-7 gap-4">
                {days.map((day) => (
                    <div
                        key={day}
                        className={`p-4 border rounded-xl text-center transition
              ${day.format("YYYY-MM-DD") === today
                                ? "bg-blue-100 border-blue-500"
                                : "bg-gray-50"}
            `}
                    >
                        <div className="font-semibold">{day.format("ddd")}</div>
                        <div className="text-2xl">{day.format("D")}</div>

                        {/* Placeholder meal area */}
                        <div className="mt-2 text-sm text-gray-400 italic">
                            (meals here)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
