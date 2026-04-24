import { getDataModel, MODEL_AUTH_OPTIONS } from "../../lib/amplifyDataClient";

function getGroceryItemModel() {
  return getDataModel("GroceryItem");
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function toItemId(item) {
  if (typeof item?.id === "string" && item.id.trim()) return item.id;
  if (typeof item?.id === "number") return String(item.id);

  return `grocery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeLoadedItem(item) {
  return {
    id: toItemId(item),
    name: item.name,
    quantity: item.quantity ?? "",
    category: item.category || "Pantry",
    source: item.source || "Manual",
    checked: Boolean(item.checked),
  };
}

function normalizeItemForSave(item) {
  return {
    id: toItemId(item),
    name: item.name,
    quantity: item.quantity ?? "",
    category: item.category || "Pantry",
    source: item.source || "Manual",
    checked: Boolean(item.checked),
  };
}

function sortGroceryItems(items) {
  return [...items].sort((a, b) => Number(a.checked) - Number(b.checked));
}

function isValidItem(item) {
  if (!item || typeof item !== "object") return false;
  if (typeof item.name !== "string" || !item.name.trim()) return false;
  return typeof item.id === "string" && item.id.trim().length > 0;
}

function areItemsEqual(a, b) {
  return (
    a.name === b.name &&
    (a.quantity ?? "") === (b.quantity ?? "") &&
    (a.category ?? "Pantry") === (b.category ?? "Pantry") &&
    (a.source ?? "Manual") === (b.source ?? "Manual") &&
    Boolean(a.checked) === Boolean(b.checked)
  );
}

async function executeModelOperation(operationPromise, fallbackMessage) {
  const result = await operationPromise;

  if (result?.errors?.length) {
    throw new Error(result.errors[0].message || fallbackMessage);
  }

  return result?.data ?? null;
}

export async function getGroceryItems() {
  const model = getGroceryItemModel();
  if (!model) return [];

  const { data } = await model.list({
    ...MODEL_AUTH_OPTIONS,
    limit: 1000,
  });

  return sortGroceryItems(ensureArray(data).map(normalizeLoadedItem).filter(isValidItem));
}

export async function saveGroceryItems(items, previousItems = []) {
  const model = getGroceryItemModel();
  if (!model) {
    throw new Error("Grocery persistence is not ready yet. Sync Amplify outputs first.");
  }

  const nextItems = sortGroceryItems(
    ensureArray(items).map(normalizeItemForSave).filter(isValidItem)
  );
  const prevItems = sortGroceryItems(
    ensureArray(previousItems).map(normalizeItemForSave).filter(isValidItem)
  );

  const nextMap = new Map(nextItems.map((item) => [item.id, item]));
  const prevMap = new Map(prevItems.map((item) => [item.id, item]));
  const operations = [];

  for (const [itemId, prevItem] of prevMap.entries()) {
    if (!nextMap.has(itemId)) {
      operations.push(
        executeModelOperation(
          model.delete({ id: prevItem.id }, MODEL_AUTH_OPTIONS),
          "Failed to remove grocery item."
        )
      );
    }
  }

  for (const [itemId, nextItem] of nextMap.entries()) {
    const prevItem = prevMap.get(itemId);

    if (!prevItem) {
      operations.push(
        executeModelOperation(
          model.create(nextItem, MODEL_AUTH_OPTIONS),
          "Failed to create grocery item."
        )
      );
      continue;
    }

    if (!areItemsEqual(prevItem, nextItem)) {
      operations.push(
        executeModelOperation(
          model.update(nextItem, MODEL_AUTH_OPTIONS),
          "Failed to update grocery item."
        )
      );
    }
  }

  await Promise.all(operations);
  return nextItems;
}

export async function addGroceryItems(itemsToAdd) {
  const model = getGroceryItemModel();
  if (!model) {
    throw new Error("Grocery persistence is not ready yet. Sync Amplify outputs first.");
  }

  const normalizedItems = ensureArray(itemsToAdd)
    .map(normalizeItemForSave)
    .filter(isValidItem);

  for (const item of normalizedItems) {
    await executeModelOperation(
      model.create(item, MODEL_AUTH_OPTIONS),
      "Failed to add grocery item."
    );
  }

  return normalizedItems;
}
