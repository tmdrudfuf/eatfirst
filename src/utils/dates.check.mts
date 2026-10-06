// Run: npm run check   (also try with TZ=Asia/Seoul)
import assert from 'node:assert/strict';

import { addDays, daysUntil, eatByGroup, relativeLabel, toDateKey } from './dates.ts';

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
console.log('dates ok');
