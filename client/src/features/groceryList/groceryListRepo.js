// Grocery list data layer — Amplify-backed with localStorage fallback & migration.

import { client } from '../../lib/amplifyClient';

const LS_ITEMS_KEY = 'groceryList';
const LS_LIST_ID_KEY = 'groceryListId';

let cachedListId = null;

/**
 * Get or create the user's single GroceryList in Amplify.
 * Caches the id in memory and localStorage.
 */
async function getOrCreateList() {
    if (cachedListId) return cachedListId;

    const stored = localStorage.getItem(LS_LIST_ID_KEY);
    if (stored) {
        cachedListId = stored;
        return cachedListId;
    }

    const { data: lists, errors } = await client.models.GroceryList.list();
    if (!errors && lists && lists.length > 0) {
        cachedListId = lists[0].id;
        localStorage.setItem(LS_LIST_ID_KEY, cachedListId);
        return cachedListId;
    }

    const today = new Date();
    const label = `Week of ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    const { data: newList } = await client.models.GroceryList.create({
        name: label,
        createdAt: today.toISOString(),
    });
    cachedListId = newList.id;
    localStorage.setItem(LS_LIST_ID_KEY, cachedListId);
    return cachedListId;
}

/**
 * Migrate localStorage items to Amplify on first use.
 * Clears localStorage after migration.
 */
async function migrateFromLocalStorage(groceryListId) {
    const raw = localStorage.getItem(LS_ITEMS_KEY);
    if (!raw) return;

    let items;
    try {
        items = JSON.parse(raw);
    } catch {
        return;
    }

    if (!Array.isArray(items) || items.length === 0) return;

    await Promise.all(
        items.map(item =>
            client.models.GroceryListItem.create({
                name: item.name || 'Item',
                quantity: item.quantity || '',
                category: item.category || 'Pantry',
                source: item.source || 'Manual',
                checked: item.checked || false,
                groceryListId,
            })
        )
    );

    localStorage.removeItem(LS_ITEMS_KEY);
}

/**
 * Load all grocery items. Falls back to localStorage on Amplify error.
 */
export async function loadItems() {
    try {
        const groceryListId = await getOrCreateList();

        const { data: existing } = await client.models.GroceryListItem.list({
            filter: { groceryListId: { eq: groceryListId } },
        });

        if (!existing || existing.length === 0) {
            await migrateFromLocalStorage(groceryListId);
        }

        const { data: items, errors } = await client.models.GroceryListItem.list({
            filter: { groceryListId: { eq: groceryListId } },
        });

        if (errors) throw new Error(errors[0].message);

        return (items || []).map(normalizeItem);
    } catch (err) {
        console.warn('Amplify load failed, falling back to localStorage:', err);
        const raw = localStorage.getItem(LS_ITEMS_KEY);
        try {
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }
}

/**
 * Add a new item. Returns the created item with its Amplify id.
 */
export async function addItem(item) {
    const groceryListId = await getOrCreateList();
    const { data, errors } = await client.models.GroceryListItem.create({
        name: item.name,
        quantity: item.quantity || '',
        category: item.category || 'Pantry',
        source: item.source || 'Manual',
        checked: item.checked || false,
        groceryListId,
    });
    if (errors) throw new Error(errors[0].message);
    return normalizeItem(data);
}

/**
 * Update an existing item by Amplify id.
 */
export async function updateItem(id, changes) {
    const { data, errors } = await client.models.GroceryListItem.update({
        id,
        ...changes,
    });
    if (errors) throw new Error(errors[0].message);
    return normalizeItem(data);
}

/**
 * Remove an item by Amplify id.
 */
export async function removeItem(id) {
    const { errors } = await client.models.GroceryListItem.delete({ id });
    if (errors) throw new Error(errors[0].message);
}

/**
 * Delete all items in the user's grocery list.
 */
export async function clearAll() {
    const groceryListId = await getOrCreateList();
    const { data: items } = await client.models.GroceryListItem.list({
        filter: { groceryListId: { eq: groceryListId } },
    });
    if (!items) return;
    await Promise.all(items.map(item => client.models.GroceryListItem.delete({ id: item.id })));
}

function normalizeItem(item) {
    return {
        id: item.id,
        name: item.name,
        quantity: item.quantity || '',
        category: item.category || 'Pantry',
        source: item.source || 'Manual',
        checked: item.checked || false,
    };
}
