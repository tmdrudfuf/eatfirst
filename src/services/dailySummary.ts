// Pure (no imports) so `npm run check` can run it under plain Node.

type Food = { name: string; eat_by: string };

// One summary per day for foods due that day or earlier. `foods` must be sorted by eat_by;
// `days` are local YYYY-MM-DD keys (string comparison works for that format).
export function dailySummaries(foods: Food[], days: string[]): { day: string; body: string }[] {
  const out: { day: string; body: string }[] = [];
  for (const day of days) {
    const due = foods.filter((f) => f.eat_by <= day);
    if (!due.length) continue;
    const others = due.length - 1;
    out.push({
      day,
      body: others
        ? `${due[0].name} and ${others} other ${others === 1 ? 'food is' : 'foods are'} on your Eat First list today.`
        : `${due[0].name} is on your Eat First list today.`,
    });
  }
  return out;
}
