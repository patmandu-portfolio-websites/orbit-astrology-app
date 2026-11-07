import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateChart } from './chart.js';
import { interpretChart } from './interpretation.js';
import { lifeAreaReadings, personalityProfile } from './personality.js';

test('expanded reading covers all ten planets and uses the selected chart settings', () => {
  for (const zodiacMode of ['tropical', 'sidereal']) {
    for (const houseSystem of ['whole-sign', 'equal', 'porphyry']) {
      const chart = calculateChart({
        birthDate: '1954-12-22',
        birthTime: '14:32',
        timezoneOffset: 12,
        latitude: -36.8485,
        longitude: 174.7633,
        zodiacMode,
        houseSystem,
      });
      const reading = interpretChart(chart);
      assert.equal(reading.placementStyles.length, 10);
      for (const style of reading.placementStyles) {
        const placement = chart.placements.find((item) => item.name === style.name);
        assert.equal(style.sign, placement.sign.name);
        assert.ok(style.description.includes(placement.sign.name));
        assert.ok(style.context.includes(`House ${placement.house}:`));
        assert.ok(!`${style.description} ${style.context}`.includes('undefined'));
      }
      assert.ok(reading.synthesis[0].includes(chart.placements[0].sign.name));
      assert.ok(reading.synthesis[0].includes(chart.placements[1].sign.name));
      assert.ok(reading.synthesis[1].includes('Mercury'));
      assert.ok(reading.synthesis[1].includes('Venus'));
      assert.ok(reading.synthesis[1].includes('Mars'));
      assert.ok(personalityProfile(chart).every((placement) => placement.relating.includes(placement.sign.name)));
      const lifeAreas = lifeAreaReadings(chart);
      assert.equal(lifeAreas.relationships.relating.length, 4);
      assert.equal(lifeAreas.career.relating.length, 1);
      assert.ok(Object.values(lifeAreas).every((area) => area.relating.every((item) => item.text && !item.text.includes('undefined'))));
    }
  }
});

test('reading omits the aspect example when no personal-planet aspect is available', () => {
  const chart = calculateChart({
    birthDate: '1995-04-17', birthTime: '14:32', timezoneOffset: 12,
    latitude: -36.8485, longitude: 174.7633,
  });
  assert.equal(interpretChart({ ...chart, aspects: [] }).synthesis.length, 3);
});
