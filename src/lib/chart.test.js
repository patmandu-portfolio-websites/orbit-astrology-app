import assert from 'node:assert/strict';
import test from 'node:test';
import * as Astronomy from 'astronomy-engine';
import { calculateChart, calculateDateOnlyChart, getPlanetaryLongitudes, zodiacPosition } from './chart.js';
import { offsetForLocalDateTime } from './timezone.js';

const aucklandBirth = {
  birthDate: '1954-12-22',
  latitude: -36.8485,
  longitude: 174.7633,
  zodiacMode: 'tropical',
};

test('1954 Auckland December 22 birth remains Sagittarius before the solstice', () => {
  const timezoneOffset = offsetForLocalDateTime('Pacific/Auckland', aucklandBirth.birthDate, '14:32');
  assert.equal(timezoneOffset, 12);
  const chart = calculateChart({ ...aucklandBirth, birthTime: '14:32', timezoneOffset });
  assert.equal(chart.date.toISOString(), '1954-12-22T02:32:00.000Z');
  assert.equal(chart.placements[0].sign.name, 'Sagittarius');
  assert.ok(Math.abs(chart.placements[0].degree - 29.70856) < 0.001);
});

test('the same Auckland birthday is Capricorn after the solstice', () => {
  const chart = calculateChart({ ...aucklandBirth, birthTime: '22:00', timezoneOffset: 12 });
  assert.equal(chart.placements[0].sign.name, 'Capricorn');
});

test('tropical solar longitude crosses Capricorn at the December solstice across years', () => {
  for (const year of [1954, 1982, 1995, 2000, 2025, 2026]) {
    const transition = Astronomy.Seasons(year).dec_solstice.date;
    const before = new Date(transition.getTime() - 60 * 60 * 1000);
    const after = new Date(transition.getTime() + 60 * 60 * 1000);
    assert.equal(zodiacPosition(getPlanetaryLongitudes(before).Sun).sign.name, 'Sagittarius');
    assert.equal(zodiacPosition(getPlanetaryLongitudes(after).Sun).sign.name, 'Capricorn');
    assert.ok(Math.abs(getPlanetaryLongitudes(transition).Sun - 270) < 0.001);
  }
});

test('zodiac boundaries use longitude rather than calendar dates', () => {
  assert.equal(zodiacPosition(269.999).sign.name, 'Sagittarius');
  assert.equal(zodiacPosition(270).sign.name, 'Capricorn');
  assert.equal(zodiacPosition(360).sign.name, 'Aries');
});

test('unknown-time reading flags the 1954 sign change and removes guessed houses and angles', () => {
  const chart = calculateDateOnlyChart({ ...aucklandBirth, timezoneId: 'Pacific/Auckland' });
  assert.equal(chart.birthTimeUnknown, true);
  assert.deepEqual(chart.placements[0].sampledSigns, ['Sagittarius', 'Capricorn']);
  assert.equal(chart.ascendant, undefined);
  assert.equal(chart.houseCusps, undefined);
  assert.equal(chart.aspects, undefined);
  assert.ok(chart.placements.every((placement) => placement.house === undefined));
});

test('date-only readings retain zodiac settings and support a manual offset', () => {
  const chart = calculateDateOnlyChart({ ...aucklandBirth, timezoneOffset: 12, zodiacMode: 'sidereal' });
  assert.equal(chart.zodiacMode, 'sidereal');
  assert.equal(chart.placements.length, 13);
  assert.deepEqual(chart.placements[0].sampledSigns, ['Sagittarius']);
});
