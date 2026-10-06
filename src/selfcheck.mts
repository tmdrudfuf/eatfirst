// Run: npm run check   (also try with TZ=Asia/Seoul)
import assert from 'node:assert/strict';

import { dailySummaries } from './services/dailySummary.ts';
import { addDays, daysUntil, eatByGroup, relativeLabel, toDateKey } from './utils/dates.ts';

// 01:00 local must stay the same calendar day (toISOString would give the previous day in UTC+9).
assert.equal(toDateKey(new Date(2026, 9, 5, 1, 0)), '2026-10-05');
assert.equal(addDays('2026-10-05', 5), '2026-10-10');
assert.equal(addDays('2026-12-30', 3), '2027-01-02');
assert.equal(addDays('2028-02-28', 1), '2028-02-29');
assert.equal(daysUntil('2026-10-10', '2026-10-05'), 5);
assert.equal(daysUntil('2026-10-03', '2026-10-05'), -2);
assert.equal(daysUntil('2026-11-02', '2026-10-30'), 3); // across a DST change in many zones
assert.equal(eatByGroup(-2), 'today');
assert.equal(eatByGroup(0), 'today');
assert.equal(eatByGroup(5), 'soon');
assert.equal(eatByGroup(6), 'later');
assert.equal(relativeLabel(-2), '2 days past Eat By');
assert.equal(relativeLabel(1), 'Tomorrow');

// Daily summary: overdue counts, quiet days are skipped, at most one message per day.
const foods = [
  { name: 'Spinach', eat_by: '2026-10-04' },
  { name: 'Milk', eat_by: '2026-10-05' },
  { name: 'Eggs', eat_by: '2026-10-08' },
];
const s = dailySummaries(foods, ['2026-10-05', '2026-10-06', '2026-10-08']);
assert.deepEqual(s.map((x) => x.day), ['2026-10-05', '2026-10-06', '2026-10-08']);
assert.equal(s[0].body, 'Spinach and 1 other food is on your Eat First list today.');
assert.equal(s[2].body, 'Spinach and 2 other foods are on your Eat First list today.');
assert.equal(dailySummaries([foods[2]], ['2026-10-05'])[0], undefined);
assert.equal(dailySummaries([foods[2]], ['2026-10-09'])[0].body, 'Eggs is on your Eat First list today.');
console.log('selfcheck ok');
