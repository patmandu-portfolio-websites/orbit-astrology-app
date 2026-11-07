import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateChart } from './chart.js';
import { dailyReading, weeklyReading } from './transits.js';

const chart = calculateChart({
  birthDate: '1954-12-22',
  birthTime: '14:32',
  timezoneOffset: 12,
  latitude: -36.8485,
  longitude: 174.7633,
});
const now = new Date('2026-11-07T06:35:00Z');

test('daily and weekly cards provide complete beginner guidance for all twelve houses', () => {
  const seen = new Set();
  for (let rotation = 0; rotation < 12; rotation += 1) {
    const rotatedChart = {
      ...chart,
      houseCusps: chart.houseCusps.map((cusp) => (cusp + rotation * 30) % 360),
    };
    for (const [period, reading] of [['day', dailyReading(rotatedChart, now)], ['week', weeklyReading(rotatedChart, now)]]) {
      assert.equal(reading.focus.length, 3);
      for (const focus of reading.focus) {
        seen.add(focus.number);
        for (const key of ['description', 'explanation', 'everyday', 'prompt']) {
          assert.ok(focus[key].length > 20, `House ${focus.number}: ${key}`);
        }
        assert.equal(focus.planetaryThemes.length, focus.planets.length);
        focus.planetaryThemes.forEach((theme, index) => {
          assert.ok(theme.startsWith(`${focus.planets[index]}: `));
          assert.ok(!theme.includes('undefined'));
        });
        assert.ok(focus.sampleCount >= 1 && focus.sampleCount <= (period === 'day' ? 1 : 7));
      }
      for (let index = 1; index < reading.focus.length; index += 1) {
        const previous = reading.focus[index - 1];
        const current = reading.focus[index];
        if (period === 'week' && previous.sampleCount !== current.sampleCount) {
          assert.ok(previous.sampleCount > current.sampleCount);
        } else {
          assert.ok(previous.planets.length >= current.planets.length);
        }
      }
    }
  }
  assert.equal(seen.size, 12);
});
