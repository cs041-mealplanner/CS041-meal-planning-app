// meal planner page

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMealPlanner } from "../features/mealPlanner/useMealPlanner";
import { listRecipes, normalizeRecipesForPlanner } from "../features/recipes/recipeStorage";


function AddMealCard({ label, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex h-[19.5rem] w-full flex-col items-center justify-center rounded-2xl border border-stone-300 bg-card px-6 py-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
        >
            <div className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-xl bg-subtle transition duration-200 group-hover:bg-white">
                <span className="text-4xl font-bold text-muted">+</span>
            </div>

            <div className="mt-4 text-xl font-semibold text-neutral-900">Add meal</div>
            <div className="mt-2 text-base text-muted">{label}</div>
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
                "flex h-24 w-[4.5rem] flex-col items-center justify-center rounded-2xl border border-stone-300",
                active ? "bg-primary text-white" : "bg-card text-neutral-500",
            ].join(" ")}
        >
            <div className="text-[1.75rem] font-bold leading-6">{d}</div>
            <div className="mt-2 text-base tracking-tight">{label}</div>
        </button>
    );
}


function DishPickerModal({ open, slot, dishesForSlot, onClose, onSelectDishId, onBrowseRecipes }) {
    if (!open || !slot) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-4xl rounded-3xl border border-stone-300 bg-card p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-3xl font-bold text-neutral-800">
                            Choose a {slot} meal
                        </div>
                        <div className="mt-2 text-base text-neutral-500">
                            Pick one dish to assign to this slot.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-primary px-4 py-2 text-base font-semibold text-white transition hover:bg-primaryDark"
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
                                className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 text-left hover:bg-stone-50"
                            >
                                <img
                                    src={d.image}
                                    alt={d.name}
                                    className="h-20 w-20 rounded-xl object-cover"
                                />

                                <div className="min-w-0">
                                    <div className="truncate text-lg font-bold text-neutral-800">
                                        {d.name}
                                    </div>

                                    <div className="mt-2 text-base text-neutral-500">
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
                        onClick={onBrowseRecipes}
                        className="rounded-xl border border-primary bg-white px-6 py-3 text-base font-semibold text-primary transition hover:bg-stone-50 hover:shadow-md"
                    >
                        Browse Recipes
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primaryDark"
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

    const [allRecipes, setAllRecipes] = useState([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadRecipes() {
            try {
                const persistedRecipes = await listRecipes();

                if (isMounted) {
                    setAllRecipes(normalizeRecipesForPlanner(persistedRecipes));
                }
            } catch (error) {
                console.error("Failed to load meal planner recipes:", error);
            } finally {
                if (isMounted) {
                    setIsLoadingRecipes(false);
                }
            }
        }

        loadRecipes();

        return () => {
            isMounted = false;
        };
    }, []);


    // destructuring values/actions returned by useMealPlanner() into local variables
    const {
        entries,
        selectedYmd,
        weekDays,
        isDirty,
        isLoading,
        isSaving,
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
        for (const d of allRecipes) map.set(d.id, d);
        return map;
    }, [allRecipes]);


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


    const shortSelectedDate = useMemo(() => {
        if (!selectedYmd) return "";

        const date = new Date(selectedYmd + "T00:00:00");

        return date.toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }, [selectedYmd]);


    const dishesForPickerSlot = useMemo(() => {
        if (!pickerSlot) return [];
        return allRecipes;
    }, [pickerSlot, allRecipes]);


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
                onBrowseRecipes={() => {
                    closePicker();
                    navigate("/recipes");
                }}
            />


            {/* HERO SECTION */}
            <section className="bg-mainbg">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-2 lg:px-6 lg:py-16">
                    <div className="flex flex-col justify-center text-center lg:text-left">
                        <h1 className="text-4xl font-extrabold leading-tight text-neutral-700 md:text-5xl">
                            Plan Your Week,
                            <br />
                            One Meal at a Time
                        </h1>

                        <p className="mt-4 text-lg text-neutral-500">
                            Build a personalized meal plan and let us handle the rest.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("meal-plan-builder")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primaryDark"
                                style={{ boxShadow: "0 8px 24px rgba(20,30,25,0.08)" }}
                            >
                                Get Started
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/recipes')}
                                className="rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white transition hover:bg-primaryDark"
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

                    <p className="mt-2 text-center text-base font-light tracking-wide text-neutral-400 md:text-lg">
                        {shortSelectedDate}
                    </p>

                    {(isLoading || isLoadingRecipes) && (
                        <div className="mt-6 text-center text-sm text-muted">
                            Loading your meal plan...
                        </div>
                    )}

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
                                    className="flex h-[19.5rem] flex-col rounded-2xl border border-stone-300 bg-card p-3.5 transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
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
                                                className="text-xs font-semibold text-primary transition hover:text-primaryDark hover:underline"
                                            >
                                                Replace
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => removeMeal(selectedYmd, slot)}
                                                className="text-xs font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    </div>

                                    <div className="mt-2.5 flex flex-1 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white">
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="aspect-square w-full max-h-[10.75rem] flex-none object-cover"
                                        />
                                        <div className="flex-none p-3">
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
                            className="rounded-xl bg-stone-200 px-6 py-3.5 text-base font-semibold text-primaryDark transition duration-200 hover:-translate-y-0.5 hover:bg-stone-300 hover:shadow-md"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={save}
                            disabled={isSaving || !isDirty}
                            className={[
                                "rounded-xl border px-6 py-3.5 text-base font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
                                isDirty
                                    ? "border-primary bg-primary text-white hover:bg-primaryDark"
                                    : "border-primary bg-white text-primary hover:bg-stone-50",
                                isSaving || !isDirty ? "cursor-default" : "",
                            ].join(" ")}
                            style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                        >
                            {isSaving ? "Saving..." : isDirty ? "Save Plan" : "Saved"}
                        </button>

                    </div>
                </div>
            </section>


            {/* WEEK SELECTOR */}
            <section className="mx-auto mt-10 w-full max-w-6xl px-4">
                <div
                    className="mx-auto w-full max-w-2xl rounded-2xl bg-subtle px-8 py-6"
                    style={{ boxShadow: "0 10px 30px rgba(20,30,25,0.08)" }}
                >
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={goPrevWeek}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition hover:bg-primaryDark"
                        >
                            {"<"}
                        </button>

                        <div className="text-center text-4xl font-semibold text-neutral-500">
                            {weekLabel}
                        </div>

                        <button
                            type="button"
                            onClick={goNextWeek}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition hover:bg-primaryDark"
                        >
                            {">"}
                        </button>
                    </div>

                    <div className="mt-5 flex flex-wrap justify-center gap-4">
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
        </div>
    );
}
