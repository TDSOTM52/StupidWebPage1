import assert from 'node:assert/strict';

const TIMEZONE = 'America/Bogota';
const INDEPENDENCE_MONTH = '07';
const INDEPENDENCE_DAY = '20';

function getColombiaDateISO(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(date);
}

function isIndependenceDay(dateISO) {
  const [, month, day] = dateISO.split('-');
  return month === INDEPENDENCE_MONTH && day === INDEPENDENCE_DAY;
}

const midnightBogota = new Date('2024-07-20T05:00:00Z');
assert.equal(getColombiaDateISO(midnightBogota), '2024-07-20');

const prevEveningUTC = new Date('2024-07-19T23:59:59Z');
assert.equal(getColombiaDateISO(prevEveningUTC), '2024-07-19');

assert.ok(isIndependenceDay('2024-07-20'));
assert.ok(!isIndependenceDay('2024-07-21'));

console.log('Date logic tests passed.');
