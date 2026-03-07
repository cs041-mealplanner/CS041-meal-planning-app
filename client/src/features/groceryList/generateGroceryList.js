/**
 * Parse a numeric amount string into { num, unit }.
 * Handles: "2 cups", "1/2 cup", "1 1/2 tbsp", plain numbers.
 */
function parseAmount(amount) {
    if (!amount) return null;
    const str = amount.trim();

    // mixed number: "1 1/2 cups"
    const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)/);
    if (mixedMatch) {
        return {
            num: parseInt(mixedMatch[1]) + parseInt(mixedMatch[2]) / parseInt(mixedMatch[3]),
            unit: mixedMatch[4].trim(),
        };
    }

    // fraction: "1/2 cup"
    const fracMatch = str.match(/^(\d+)\/(\d+)\s*(.*)/);
    if (fracMatch) {
        return {
            num: parseInt(fracMatch[1]) / parseInt(fracMatch[2]),
            unit: fracMatch[3].trim(),
        };
    }

    // plain number: "2 large", "3"
    const numMatch = str.match(/^(\d+(?:\.\d+)?)\s*(.*)/);
    if (numMatch) {
        return {
            num: parseFloat(numMatch[1]),
            unit: numMatch[2].trim(),
        };
    }

    return null;
}

function mergeAmounts(a, b) {
    const pa = parseAmount(a);
    const pb = parseAmount(b);

    if (pa && pb && pa.unit.toLowerCase() === pb.unit.toLowerCase()) {
        const sum = pa.num + pb.num;
        const numStr = Number.isInteger(sum) ? String(sum) : parseFloat(sum.toFixed(2)).toString();
        return pa.unit ? `${numStr} ${pa.unit}` : numStr;
    }

    return `${a} + ${b}`;
}

/**
 * Takes mealPlanEntries ({ date, slot, dishId }[]) and dishes (dish.json array).
 * Returns merged grocery item array ready to be added to the grocery list.
 */
export function generateFromMealPlan(entries, dishes) {
    const dishMap = new Map(dishes.map(d => [d.id, d]));
    const ingredientMap = new Map(); // key: lowercase item name

    for (const entry of entries) {
        const dish = dishMap.get(entry.dishId);
        if (!dish) continue;

        for (const ingredient of dish.ingredients) {
            const key = ingredient.item.toLowerCase();

            if (ingredientMap.has(key)) {
                const existing = ingredientMap.get(key);
                existing.quantity = mergeAmounts(existing.quantity, ingredient.amount);
                if (!existing.sources.includes(dish.name)) {
                    existing.sources.push(dish.name);
                }
            } else {
                ingredientMap.set(key, {
                    name: ingredient.item,
                    quantity: ingredient.amount,
                    category: ingredient.category,
                    sources: [dish.name],
                    checked: false,
                });
            }
        }
    }

    return Array.from(ingredientMap.values()).map(item => ({
        name: item.name,
        quantity: item.quantity,
        category: item.category,
        source: item.sources.map(s => `From ${s}`).join(', '),
        checked: false,
    }));
}

/**
 * Returns the unique dish names from current week's meal plan entries.
 */
export function getWeekDishNames(entries, dishes) {
    const dishMap = new Map(dishes.map(d => [d.id, d]));
    const names = new Set();
    for (const entry of entries) {
        const dish = dishMap.get(entry.dishId);
        if (dish) names.add(dish.name);
    }
    return Array.from(names);
}
