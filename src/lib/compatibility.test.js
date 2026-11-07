import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateChart, calculateDateOnlyChart } from './chart.js';
import { compareCharts, compareNumerology } from './compatibility.js';

const values = {
  birthDate: '1954-12-22', birthTime: '14:32', timezoneOffset: 12,
  latitude: -36.8485, longitude: 174.7633,
};
const first = calculateChart(values);
const second = calculateChart({ ...values, birthDate: '1982-07-08' });

test('comparison includes five areas and only cross-chart aspects', () => {
  const result = compareCharts(first, second);
  assert.equal(result.readings.length, 5);
  assert.ok(result.aspects.length > 0);
  assert.ok(result.aspects.every((aspect) => aspect.a.owner === 'first' && aspect.b.owner === 'second'));
  assert.equal(new Set(result.aspects.map((aspect) => `${aspect.a.name}-${aspect.b.name}`)).size, result.aspects.length);
  assert.ok(result.readings.every((area) => area.prompt && area.reflection && area.firstDescription && area.secondDescription));
  assert.ok(result.readings.every((area) => area.relating && area.everyday && !area.relating.includes('undefined')));
  assert.ok(result.aspects.every((aspect) => aspect.relating && !aspect.relating.includes('undefined')));
});

test('unknown times suppress aspects and flag changing sign interpretations', () => {
  const unknown = calculateDateOnlyChart(values);
  const result = compareCharts(unknown, second);
  assert.equal(result.timeUnknown, true);
  assert.equal(result.aspects.length, 0);
  const sun = result.readings.find((area) => area.name === 'Sun');
  assert.equal(sun.firstSigns, 'Sagittarius / Capricorn');
  assert.equal(sun.firstDescription, null);
  assert.ok(sun.relating.includes('without attaching it to either possible sign'));
  assert.ok(sun.everyday);
  assert.throws(() => compareCharts(first, { ...second, zodiacMode: 'sidereal' }), /same zodiac/);
});

test('identical charts retain cross-person conjunctions without duplicate or intra-chart entries', () => {
  const result = compareCharts(first, first);
  assert.equal(result.aspects.filter((aspect) => aspect.name === 'Conjunction' && aspect.a.name === aspect.b.name).length, 5);
});

test('numerology includes shared available inputs without inventing missing name numbers', () => {
  const blank = { birthDate: '1954-12-22', birthName: '' };
  assert.equal(compareNumerology(blank, { ...blank, birthName: 'John Doe' }).length, 3);
  const named = compareNumerology({ ...blank, birthName: 'Jane Doe' }, { ...blank, birthName: 'John Doe' });
  assert.equal(named.length, 5);
  assert.ok(named.every((number) => number.firstMeaning && number.secondMeaning));
  assert.ok(named.every((number) => number.firstEveryday && number.secondEveryday));
});
