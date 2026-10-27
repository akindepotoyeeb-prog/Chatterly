export function filterText(items, query, fields) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return items;
  return items.filter((item) =>
    fields.some((field) =>
      String(item?.[field] ?? "")
        .toLowerCase()
        .includes(q),
    ),
  );
}
export function readPreference(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
}
export function writePreference(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
