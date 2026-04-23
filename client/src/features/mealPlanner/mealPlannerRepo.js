// repo for MealPlanner page
import { getMigratedScopedJson, setScopedJson } from "../../lib/userStorage";

const STORAGE_KEY = "mealPlanEntries";

/**
 * MealPlanEntry:
 * {
 *   date: "YYYY-MM-DD",
 *   slot: "breakfast" | "lunch" | "dinner",
 *   dishId: number | string (pool-XXX or manual-XXX)
 * }
 */

function isValidEntry(e) {
    if (!e || typeof e !== "object") return false;
    if (typeof e.date !== "string") return false;
    if (!["breakfast", "lunch", "dinner"].includes(e.slot)) return false;
    // Accept both numbers (old dish.json IDs) and strings (pool/manual IDs)
    if (typeof e.dishId !== "number" && typeof e.dishId !== "string") return false;
    return true;
}

export function loadMealPlanEntries() {
    const parsed = getMigratedScopedJson(STORAGE_KEY, []);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
}

export function saveMealPlanEntries(entries) {
    // assume caller sends an array of valid entries
    setScopedJson(STORAGE_KEY, entries);
}
