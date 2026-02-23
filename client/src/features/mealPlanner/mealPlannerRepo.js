// repo for MealPlanner page

const STORAGE_KEY = "mealPlanEntries";

/**
 * MealPlanEntry:
 * {
 *   date: "YYYY-MM-DD",
 *   slot: "breakfast" | "lunch" | "dinner",
 *   dishId: number
 * }
 */

function isValidEntry(e) {
  if (!e || typeof e !== "object") return false;
  if (typeof e.date !== "string") return false;
  if (!["breakfast", "lunch", "dinner"].includes(e.slot)) return false;
  if (typeof e.dishId !== "number") return false;
  return true;
}

export function loadMealPlanEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidEntry);
  } catch {
    return [];
  }
}

export function saveMealPlanEntries(entries) {
  // assume caller sends an array of valid entries
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}