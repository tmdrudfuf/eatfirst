export function normalizeFoodName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function cleanFoodName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
