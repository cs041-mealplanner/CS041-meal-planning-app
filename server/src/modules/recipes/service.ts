import { TTLCache } from '../../utils/cache';

const cache = new TTLCache<any>(5 * 60 * 1000);

export async function searchRecipes(params: { category?: string; keyword?: string }) {
  const key = JSON.stringify(params);
  const cached = cache.get(key);
  if (cached) return cached;

  const base = process.env.RECIPE_API_BASE;
  const apiKey = process.env.RECIPE_API_KEY;
  if (!base || !apiKey) {
    const empty = { results: [] as any[] };
    cache.set(key, empty);
    return empty;
  }

  const url = new URL(base);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.keyword) url.searchParams.set('q', params.keyword);
  url.searchParams.set('apiKey', apiKey);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    const empty = { results: [] as any[] };
    cache.set(key, empty);
    return empty;
  }
  const data = (await resp.json()) as any;
  const normalized = normalize(data);
  cache.set(key, normalized);
  return normalized;
}

function normalize(providerData: any): { results: Array<{ title: string; id: string; ingredients: string[]; calories?: number }> } {
  if (Array.isArray(providerData?.results)) {
    return {
      results: providerData.results.map((r: any) => ({
        title: String(r.title ?? r.name ?? ''),
        id: String(r.id ?? r.recipeId ?? ''),
        ingredients: (r.ingredients ?? r.extendedIngredients ?? []).map((i: any) => String(i.name ?? i)),
        calories: typeof r.calories === 'number' ? r.calories : undefined,
      })),
    };
  }
  // Fallback
  return { results: [] };
}


