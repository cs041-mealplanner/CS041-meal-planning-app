import { getMigratedScopedJson, getScopedStorageKey, setScopedJson } from "../../lib/userStorage";

const GROCERY_LIST_KEY = "groceryList";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getGroceryItems() {
  return ensureArray(getMigratedScopedJson(GROCERY_LIST_KEY, []));
}

export function saveGroceryItems(items) {
  setScopedJson(GROCERY_LIST_KEY, ensureArray(items));
}

export function getGroceryStorageKey() {
  return getScopedStorageKey(GROCERY_LIST_KEY);
}
