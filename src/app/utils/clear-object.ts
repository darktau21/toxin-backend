export function clearObject<T extends Record<string, unknown>>(obj: T) {
  const copy = { ...obj };

  Object.entries(copy).forEach(([key, value]) => {
    if (typeof value === 'undefined') delete copy[key];
  });

  return copy;
}
