const APP_PREFIX = "nourishly";
const CURRENT_USER_KEY = `${APP_PREFIX}.currentUser`;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeScopeValue(user) {
  if (typeof user === "string" && user.trim()) {
    return user.trim().toLowerCase();
  }

  if (!user || typeof user !== "object") return null;

  const candidate =
    user.username ||
    user.userId ||
    user.signInDetails?.loginId ||
    user.signInDetails?.username;

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim().toLowerCase();
  }

  return null;
}

function readJsonByKey(storageKey) {
  if (!canUseStorage()) return { found: false, value: null };

  const raw = window.localStorage.getItem(storageKey);
  if (raw == null) return { found: false, value: null };

  try {
    return { found: true, value: JSON.parse(raw) };
  } catch {
    return { found: false, value: null };
  }
}

export function setCurrentUserStorageScope(user) {
  if (!canUseStorage()) return;

  const scope = normalizeScopeValue(user);
  if (!scope) return;

  window.localStorage.setItem(CURRENT_USER_KEY, scope);
}

export function clearCurrentUserStorageScope() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}

export function getCurrentUserStorageScope() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(CURRENT_USER_KEY);
}

export function getScopedStorageKey(key) {
  const scope = getCurrentUserStorageScope() || "guest";
  return `${APP_PREFIX}.${scope}.${key}`;
}

export function getScopedJson(key, fallbackValue) {
  const scoped = readJsonByKey(getScopedStorageKey(key));
  return scoped.found ? scoped.value : fallbackValue;
}

export function getMigratedScopedJson(key, fallbackValue) {
  const scopedKey = getScopedStorageKey(key);
  const scoped = readJsonByKey(scopedKey);

  if (scoped.found) return scoped.value;

  const legacy = readJsonByKey(key);
  if (legacy.found) {
    window.localStorage.setItem(scopedKey, JSON.stringify(legacy.value));
    return legacy.value;
  }

  return fallbackValue;
}

export function setScopedJson(key, value) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(getScopedStorageKey(key), JSON.stringify(value));
}
