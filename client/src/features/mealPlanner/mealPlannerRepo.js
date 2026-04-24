import { getDataModel, MODEL_AUTH_OPTIONS } from "../../lib/amplifyDataClient";

const VALID_SLOTS = ["breakfast", "lunch", "dinner"];

function getMealPlanEntryModel() {
  return getDataModel("MealPlanEntry");
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function toEntryId(date, slot) {
  return `${date}|${slot}`;
}

function isValidEntry(entry) {
  if (!entry || typeof entry !== "object") return false;
  if (typeof entry.date !== "string") return false;
  if (!VALID_SLOTS.includes(entry.slot)) return false;
  if (typeof entry.dishId !== "string" && typeof entry.dishId !== "number") return false;
  return true;
}

function normalizeLoadedEntry(entry) {
  return {
    id: entry.id,
    date: entry.date,
    slot: entry.slot,
    dishId: entry.recipeId,
  };
}

function normalizeEntryForSave(entry) {
  return {
    id: entry.id || toEntryId(entry.date, entry.slot),
    date: entry.date,
    slot: entry.slot,
    recipeId: String(entry.dishId),
  };
}

function sortEntries(entries) {
  return [...entries].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.slot.localeCompare(b.slot);
  });
}

async function executeModelOperation(operationPromise, fallbackMessage) {
  const result = await operationPromise;

  if (result?.errors?.length) {
    throw new Error(result.errors[0].message || fallbackMessage);
  }

  return result?.data ?? null;
}

export async function loadMealPlanEntries() {
  const model = getMealPlanEntryModel();
  if (!model) return [];

  const { data } = await model.list({
    ...MODEL_AUTH_OPTIONS,
    limit: 1000,
  });

  return sortEntries(ensureArray(data).map(normalizeLoadedEntry).filter(isValidEntry));
}

export async function saveMealPlanEntries(entries, previousEntries = []) {
  const model = getMealPlanEntryModel();
  if (!model) {
    throw new Error("Meal planner persistence is not ready yet. Sync Amplify outputs first.");
  }

  const nextEntries = sortEntries(ensureArray(entries).filter(isValidEntry));
  const prevEntries = sortEntries(ensureArray(previousEntries).filter(isValidEntry));

  const nextMap = new Map(
    nextEntries.map((entry) => [toEntryId(entry.date, entry.slot), normalizeEntryForSave(entry)])
  );
  const prevMap = new Map(
    prevEntries.map((entry) => [toEntryId(entry.date, entry.slot), normalizeEntryForSave(entry)])
  );

  const operations = [];

  for (const [entryId, prevEntry] of prevMap.entries()) {
    if (!nextMap.has(entryId)) {
      operations.push(
        executeModelOperation(
          model.delete({ id: prevEntry.id }, MODEL_AUTH_OPTIONS),
          "Failed to remove meal plan entry."
        )
      );
    }
  }

  for (const [entryId, nextEntry] of nextMap.entries()) {
    const prevEntry = prevMap.get(entryId);

    if (!prevEntry) {
      operations.push(
        executeModelOperation(
          model.create(nextEntry, MODEL_AUTH_OPTIONS),
          "Failed to create meal plan entry."
        )
      );
      continue;
    }

    if (prevEntry.recipeId !== nextEntry.recipeId) {
      operations.push(
        executeModelOperation(
          model.update(nextEntry, MODEL_AUTH_OPTIONS),
          "Failed to update meal plan entry."
        )
      );
    }
  }

  await Promise.all(operations);
}
