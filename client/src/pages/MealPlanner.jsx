// meal planner page

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMealPlanner } from "../features/mealPlanner/useMealPlanner";

import dishes from "../data/dish.json";

function AddMealCard({ label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center rounded-2xl border border-stone-300 bg-card px-10 py-8 shadow-sm"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-subtle">
                <span className="text-3xl font-bold text-muted">+</span>
            </div>

            <div className="mt-3 text-sm font-semibold text-neutral-900">Add meal</div>
            <div className="mt-1 text-xs text-muted">{label}</div>
        </button>
    );
}

function MealCard({ meal }) {
    return (
        <div
            className="overflow-hidden rounded-2xl border border-stone-300 bg-card"
            style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
        >
            <img
                src={meal.imageUrl}
                alt={meal.title}
                className="h-64 w-full object-cover"
            />
            <div className="p-4">
                <div className="text-lg font-bold text-neutral-700">{meal.title}</div>
                <div className="mt-1 text-sm text-neutral-500">{meal.meta}</div>
            </div>
        </div>
    );
}

function DayPill({ d, label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex h-20 w-14 flex-col items-center justify-center rounded-2xl border border-stone-300",
                active ? "bg-primary text-white" : "bg-card text-neutral-500",
            ].join(" ")}
        >
            <div className="text-xl font-bold leading-4">{d}</div>
            <div className="mt-1 text-xs tracking-tight">{label}</div>
        </button>
    );
}

function DishPickerModal({ open, slot, dishesForSlot, onClose, onSelectDishId }) {
    if (!open || !slot) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-2xl rounded-3xl border border-stone-300 bg-card p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-xl font-bold text-neutral-800">
                            Choose a {slot} meal
                        </div>
                        <div className="mt-1 text-sm text-neutral-500">
                            Pick one dish to assign to this slot.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-stone-300 bg-card px-3 py-1 text-sm font-semibold text-neutral-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-5 max-h-[55vh] overflow-auto rounded-2xl border border-stone-200">
                    <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                        {dishesForSlot.map((d) => (
                            <button
                                key={d.id}
                                type="button"
                                onClick={() => onSelectDishId(d.id)}
                                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left hover:bg-stone-50"
                            >
                                <img
                                    src={d.image}
                                    alt={d.name}
                                    className="h-16 w-16 rounded-xl object-cover"
                                />
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-bold text-neutral-800">
                                        {d.name}
                                    </div>
                                    <div className="mt-1 text-xs text-neutral-500">
                                        {d.nutrition?.calories ?? "?"} kcal
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-stone-200 px-5 py-3 text-sm font-semibold text-primaryDark"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MealPlanner() {
    const navigate = useNavigate();

    // destructuring values/actions returned by useMealPlanner() into local variables
    const {
        entries,
        selectedYmd,
        weekDays,
        isDirty,
        goPrevWeek,
        goNextWeek,
        setSelectedDate,
        save,
        getEntry,
        setMeal,
        removeMeal,
    } = useMealPlanner();

    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerSlot, setPickerSlot] = useState(null);

    const dishById = useMemo(() => {
        const map = new Map();
        for (const d of dishes) map.set(d.id, d);
        return map;
    }, []);

    const mealsForDay = useMemo(() => {
        const dayEntries = entries
            .filter((e) => e.date === selectedYmd)
            .sort((a, b) => a.slot.localeCompare(b.slot));

        return dayEntries
            .map((e) => {
                const dish = dishById.get(e.dishId);
                return dish
                    ? {
                          id: `${e.date}|${e.slot}|${e.dishId}`,
                          title: dish.name,
                          meta: `${dish.nutrition?.calories ?? "?"} kcal • ${e.slot}`,
                          imageUrl: dish.image,
                      }
                    : null;
            })
            .filter(Boolean);
    }, [entries, selectedYmd, dishById]);

    const weekLabel = useMemo(() => {
        if (!weekDays || weekDays.length === 0) return "";

        const start = weekDays[0].dateObj;
        const end = weekDays[6].dateObj;

        const sameMonth =
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear();

        const monthStart = start.toLocaleDateString(undefined, { month: "long" });
        const monthEnd = end.toLocaleDateString(undefined, { month: "long" });

        const startDay = start.getDate();
        const endDay = end.getDate();

        if (sameMonth) {
            return `${monthStart} ${startDay}-${endDay}`;
        }
        return `${monthStart} ${startDay} - ${monthEnd} ${endDay}`;
    }, [weekDays]);

    const formattedSelectedDate = useMemo(() => {
        if (!selectedYmd) return "";

        const date = new Date(selectedYmd + "T00:00:00");

        return date.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }, [selectedYmd]);

    const dishesForPickerSlot = useMemo(() => {
        if (!pickerSlot) return [];
        return dishes.filter((d) => d.meal === pickerSlot);
    }, [pickerSlot]);

    function openPicker(slot) {
        setPickerSlot(slot);
        setPickerOpen(true);
    }

    function closePicker() {
        setPickerOpen(false);
        setPickerSlot(null);
    }

    function selectDish(dishId) {
        if (!pickerSlot) return;
        setMeal(selectedYmd, pickerSlot, dishId);
        closePicker();
    }

    return (
        <div className="min-h-screen bg-secondarybg">
            <DishPickerModal
                open={pickerOpen}
                slot={pickerSlot}
                dishesForSlot={dishesForPickerSlot}
                onClose={closePicker}
                onSelectDishId={selectDish}
            />

            {/* HERO */}
            <section className="w-full border-b border-stone-300 bg-gradient-to-b from-mainbg to-[#FFF7ED]">
                <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-stretch gap-0 px-6 py-14 md:grid-cols-2">
                    <div className="py-2">
                        <h1 className="text-4xl font-bold leading-tight text-primaryDark md:text-5xl">
                            Plan your perfect week of meals
                        </h1>

                        <p className="mt-4 text-lg text-muted">
                            Build a plan, track calories, and generate a shopping list in seconds.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    document
                                        .getElementById("meal-plan-builder")
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className="rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white"
                                style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                            >
                                Create My Plan
                            </button>

                            <button
                                type="button"
                                onClick={() => console.log("TODO: Browse Recipes")} // TODO: navigate to recipe browsing page
                                className="rounded-xl border border-primary bg-transparent px-5 py-3 text-base font-semibold text-primary"
                                style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div
                            className="w-full max-w-md overflow-hidden rounded-3xl bg-card"
                            style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                        >
                            <img
                                src="https://placehold.co/493x403"
                                alt="Meal"
                                className="h-80 w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* BUILD MEAL PLAN CARD */}
            <section 
                id="meal-plan-builder"
                className="mx-auto mt-10 w-full max-w-6xl px-4"
                >
                <div
                    className="rounded-3xl bg-card px-6 py-10 md:px-10"
                    style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                >
                    <h2 className="text-center text-3xl font-bold text-neutral-700">
                        🍴 Build Your Meal Plan
                    </h2>

                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {["breakfast", "lunch", "dinner"].map((slot) => {
                            const entry = getEntry(selectedYmd, slot);
                            const dish = entry ? dishById.get(entry.dishId) : null;

                            if (!dish) {
                                return (
                                    <AddMealCard
                                        key={slot}
                                        label={slot[0].toUpperCase() + slot.slice(1)}
                                        onClick={() => openPicker(slot)}
                                    />
                                );
                            }

                            return (
                                <div
                                    key={slot}
                                    className="rounded-2xl border border-stone-300 bg-card p-4"
                                    style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="text-sm font-semibold text-neutral-700 capitalize">
                                            {slot}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openPicker(slot)}
                                                className="text-xs font-semibold text-primary"
                                            >
                                                Replace
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeMeal(selectedYmd, slot)}
                                                className="text-xs font-semibold text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white">
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="h-40 w-full object-cover"
                                        />
                                        <div className="p-3">
                                            <div className="text-base font-bold text-neutral-800">
                                                {dish.name}
                                            </div>
                                            <div className="mt-1 text-sm text-neutral-500">
                                                {dish.nutrition?.calories ?? "?"} kcal
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-xl bg-stone-200 px-5 py-3 text-sm font-semibold text-primaryDark"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={save}
                            className="rounded-xl border border-primary bg-transparent px-5 py-3 text-sm font-semibold text-primary"
                            style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                        >
                            {isDirty ? "Save Plan" : "Saved ✓"}
                        </button>
                    </div>
                </div>
            </section>

            {/* WEEK SELECTOR */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4">
                <div className="mx-auto w-full max-w-xl rounded-2xl bg-subtle px-6 py-5">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={goPrevWeek}
                            className="h-6 w-7 rounded-lg border border-stone-300 bg-card text-xs text-neutral-500"
                        >
                            {"<"}
                        </button>

                        <div className="text-center text-3xl font-semibold text-neutral-500">
                            {weekLabel}
                        </div>

                        <button
                            type="button"
                            onClick={goNextWeek}
                            className="h-6 w-7 rounded-lg border border-stone-300 bg-card text-xs text-neutral-500"
                        >
                            {">"}
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        {weekDays.map((x) => (
                            <DayPill
                                key={x.ymd}
                                d={String(x.dayNumber)}
                                label={x.label}
                                active={x.ymd === selectedYmd}
                                onClick={() => setSelectedDate(x.dateObj)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* MEALS FOR SELECTED DAY */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4 pb-14">
                <h3 className="mb-4 text-2xl font-bold text-neutral-800">
                    Meals for {formattedSelectedDate}
                </h3>

                {mealsForDay.length === 0 ? (
                    <div className="rounded-2xl border border-stone-300 bg-card p-8 text-center text-neutral-500">
                        No planned meals.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {mealsForDay.map((meal) => (
                            <MealCard key={meal.id} meal={meal} />
                        ))}
                    </div>
                )}
            </section>

            {/* FOOTER TEMPORARY */}
            <footer className="mt-10 bg-headerbg py-10">
                <div className="mx-auto max-w-6xl px-4 text-center text-sm font-normal text-neutral-500">
                    © Nourishly 2025 • Privacy • Terms
                </div>
            </footer>
        </div>
    );
}