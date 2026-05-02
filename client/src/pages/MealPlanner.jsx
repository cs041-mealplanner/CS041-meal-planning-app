import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMealPlanner } from "../features/mealPlanner/useMealPlanner";
import { listRecipes, normalizeRecipesForPlanner } from "../features/recipes/recipeStorage";

function AddMealCard({ label, onClick, disabled = false }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={[
                "group flex min-h-56 w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-card px-6 py-6 shadow-sm transition duration-200 md:min-h-[19.5rem]",
                disabled
                    ? "cursor-not-allowed opacity-70"
                    : "hover:-translate-y-1 hover:border-primary/50 hover:bg-subtle hover:shadow-md",
            ].join(" ")}
        >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-subtle transition duration-200 group-hover:bg-card">
                <span className="text-4xl font-bold text-primary">+</span>
            </div>

            <div className="mt-4 text-xl font-bold text-primaryDark">Add meal</div>
            <div className="mt-1 text-sm font-medium text-muted">{label}</div>
        </button>
    );
}

function MealCard({ meal }) {
    return (
        <div className="overflow-hidden rounded-3xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <img
                src={meal.imageUrl}
                alt={meal.title}
                className="h-56 w-full object-cover sm:h-64"
            />
            <div className="p-5">
                <div className="line-clamp-2 text-lg font-bold text-primaryDark">{meal.title}</div>
                <div className="mt-1 text-sm text-muted">{meal.meta}</div>
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
                "flex h-20 min-w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border-2 transition-colors sm:h-24 sm:min-w-[4.75rem]",
                active
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-transparent bg-card text-muted hover:bg-subtle hover:text-primaryDark",
            ].join(" ")}
        >
            <div className="text-2xl font-bold leading-6 sm:text-3xl">{d}</div>
            <div className="mt-2 text-sm font-semibold tracking-tight">{label}</div>
        </button>
    );
}

function DishPickerModal({ open, slot, dishesForSlot, onClose, onSelectDishId, onBrowseRecipes }) {
    if (!open || !slot) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
        >
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-card p-4 shadow-xl sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="text-2xl font-bold text-primaryDark sm:text-3xl">
                            Choose a {slot} meal
                        </div>
                        <div className="mt-2 text-sm text-muted sm:text-base">
                            Pick one recipe to assign to this slot.
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-subtle text-primaryDark transition hover:bg-primary hover:text-white sm:self-auto"
                        aria-label="Close meal picker"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-5 max-h-[55vh] overflow-auto rounded-2xl border border-gray-100">
                    {dishesForSlot.length === 0 ? (
                        <div className="p-8 text-center text-muted">
                            No recipes available yet. Browse recipes or create one first.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
                            {dishesForSlot.map((d) => (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => onSelectDishId(d.id)}
                                    className="flex items-center gap-4 rounded-2xl bg-white p-4 text-left transition hover:bg-subtle"
                                >
                                    <img
                                        src={d.image}
                                        alt={d.name}
                                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                                    />

                                    <div className="min-w-0">
                                        <div className="truncate text-base font-bold text-primaryDark sm:text-lg">
                                            {d.name}
                                        </div>

                                        <div className="mt-1 text-sm text-muted">
                                            {d.nutrition?.calories ?? "?"} kcal
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <button
                        type="button"
                        onClick={onBrowseRecipes}
                        className="w-full rounded-2xl border-2 border-primary bg-card px-6 py-3 font-bold text-primary transition hover:bg-subtle sm:w-auto"
                    >
                        Browse Recipes
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-2xl bg-primary px-6 py-3 font-bold text-white transition hover:bg-primaryDark sm:w-auto"
                    >
                        Done
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
    const isPlannerBusy = isLoading || isLoadingRecipes;

    const dishById = useMemo(() => {
        const map = new Map();
        for (const d of allRecipes) map.set(d.id, d);
        return map;
    }, [allRecipes]);

    const mealsForDay = useMemo(() => {
        const slotOrder = { breakfast: 0, lunch: 1, dinner: 2 };
        const dayEntries = entries
            .filter((e) => e.date === selectedYmd)
            .sort((a, b) => (slotOrder[a.slot] ?? 99) - (slotOrder[b.slot] ?? 99));

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
        if (isPlannerBusy) return;
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
        <div className="min-h-screen bg-mainbg">
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

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                <section className="mb-8 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex rounded-full bg-subtle px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary">
                                Weekly meal planner
                            </div>

                            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-primaryDark sm:text-4xl lg:text-5xl">
                                Plan your week, one meal at a time
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base lg:text-lg">
                                Build your weekly meal plan, assign recipes to breakfast, lunch, and dinner, then save when you are ready.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                            <button
                                type="button"
                                onClick={() =>
                                    document
                                        .getElementById("meal-plan-builder")
                                        ?.scrollIntoView({ behavior: "smooth" })
                                }
                                className="rounded-2xl bg-primary px-6 py-3 font-bold text-white shadow-sm transition hover:bg-primaryDark"
                            >
                                Create My Plan
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/recipes')}
                                className="rounded-2xl border-2 border-primary bg-card px-6 py-3 font-bold text-primary transition hover:bg-subtle"
                            >
                                Browse Recipes
                            </button>
                        </div>
                    </div>
                </section>

                <section id="meal-plan-builder" className="mb-8 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-primaryDark sm:text-3xl">
                            🍴 Build Your Meal Plan
                        </h2>

                        <p className="mt-2 text-sm text-muted sm:text-base">
                            {shortSelectedDate}
                        </p>
                    </div>

                    {(isLoading || isLoadingRecipes) && (
                        <div className="mb-6 rounded-2xl bg-subtle p-4 text-center text-sm text-muted">
                            Loading your meal plan...
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {["breakfast", "lunch", "dinner"].map((slot) => {
                            const entry = getEntry(selectedYmd, slot);
                            const dish = entry ? dishById.get(entry.dishId) : null;

                            if (!dish) {
                                return (
                                    <AddMealCard
                                        key={slot}
                                        label={slot[0].toUpperCase() + slot.slice(1)}
                                        onClick={() => openPicker(slot)}
                                        disabled={isPlannerBusy}
                                    />
                                );
                            }

                            return (
                                <div
                                    key={slot}
                                    className="flex min-h-[19.5rem] flex-col rounded-3xl bg-card p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="rounded-full bg-subtle px-3 py-1 text-xs font-bold capitalize text-primaryDark">
                                            {slot}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => openPicker(slot)}
                                                disabled={isPlannerBusy}
                                                className="text-xs font-bold text-primary transition hover:text-primaryDark disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Replace
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => removeMeal(selectedYmd, slot)}
                                                disabled={isPlannerBusy}
                                                className="text-xs font-bold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex flex-1 flex-col overflow-hidden rounded-2xl bg-white">
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="h-44 w-full flex-none object-cover"
                                        />
                                        <div className="flex-none p-4">
                                            <div className="line-clamp-2 text-base font-bold text-primaryDark">
                                                {dish.name}
                                            </div>

                                            <div className="mt-1 text-sm text-muted">
                                                {dish.nutrition?.calories ?? "?"} kcal
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="rounded-2xl border-2 border-primary bg-card px-6 py-3 font-bold text-primary transition hover:bg-subtle"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={save}
                            disabled={isPlannerBusy || isSaving || !isDirty}
                            className={[
                                "rounded-2xl px-6 py-3 font-bold transition",
                                isDirty
                                    ? "bg-primary text-white hover:bg-primaryDark"
                                    : "border-2 border-primary bg-white text-primary",
                                isPlannerBusy || isSaving || !isDirty ? "cursor-default opacity-80" : "shadow-sm",
                            ].join(" ")}
                        >
                            {isSaving ? "Saving..." : isDirty ? "Save Plan" : "Saved"}
                        </button>
                    </div>
                </section>

                <section className="mb-8 rounded-3xl bg-card p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={goPrevWeek}
                            className="flex h-11 w-full items-center justify-center rounded-2xl bg-subtle font-bold text-primaryDark transition hover:bg-primary hover:text-white sm:w-11"
                            aria-label="Previous week"
                        >
                            ←
                        </button>

                        <div className="text-center">
                            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Current week</div>
                            <div className="mt-1 text-2xl font-bold text-primaryDark sm:text-3xl">
                                {weekLabel}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={goNextWeek}
                            className="flex h-11 w-full items-center justify-center rounded-2xl bg-subtle font-bold text-primaryDark transition hover:bg-primary hover:text-white sm:w-11"
                            aria-label="Next week"
                        >
                            →
                        </button>
                    </div>

                    <div className="relative -mx-5 sm:mx-0">
                        <div className="flex gap-3 overflow-x-auto px-5 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
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
                        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-card to-transparent sm:hidden" />
                    </div>
                </section>

                <section className="pb-4 sm:pb-6">
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-primaryDark sm:text-3xl">
                            Meals for {formattedSelectedDate}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                            Saved meals for the selected day.
                        </p>
                    </div>

                    {mealsForDay.length === 0 ? (
                        <div className="rounded-3xl bg-card p-8 text-center text-muted shadow-sm">
                            No planned meals yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {mealsForDay.map((meal) => (
                                <MealCard key={meal.id} meal={meal} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
