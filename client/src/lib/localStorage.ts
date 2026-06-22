export function saveVisitedMangasToLocalStorage(
  field: string,
  value: unknown,
): boolean {
  try {
    const storedValue = localStorage.getItem(field);
    const storedItems = storedValue ? JSON.parse(storedValue) : [];
    const items = Array.isArray(storedItems) ? storedItems : [storedItems];
    const valueId =
      typeof value === "object" && value !== null && "id" in value
        ? value.id
        : undefined;

    const filteredItems =
      valueId === undefined
        ? items
        : items.filter((item) => {
            if (typeof item !== "object" || item === null || !("id" in item)) {
              return true;
            }

            return item.id !== valueId;
          });

    const nextItems = [...filteredItems, value].slice(-5);

    localStorage.setItem(field, JSON.stringify(nextItems));
    return true;
  } catch {
    return false;
  }
}

export function getVisitedMangasFromLocalStorage(
  field: string,
): { id: string; chapter: string }[] | [] {
  try {
    const item = localStorage.getItem(field);
    if (!item) return [];
    return JSON.parse(item);
  } catch (e) {
    console.log(e);
    return [];
  }
}

export function clearItemFromLocalStorage(field: string): boolean {
  try {
    localStorage.removeItem(field);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
