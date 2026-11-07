import { getPlanetaryLongitudes, houseForLongitude, zodiacPosition } from './chart.js';
import { houses } from '../data/astrology.js';

const movingBodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
const aspects = [
  { name: 'Conjunction', symbol: '☌', angle: 0 },
  { name: 'Sextile', symbol: '⚹', angle: 60 },
  { name: 'Square', symbol: '□', angle: 90 },
  { name: 'Trine', symbol: '△', angle: 120 },
  { name: 'Opposition', symbol: '☍', angle: 180 },
];

const transitThemes = {
  Sun: 'vitality and focus',
  Moon: 'feelings and immediate needs',
  Mercury: 'ideas and conversations',
  Venus: 'connection and values',
  Mars: 'initiative and energy',
  Jupiter: 'growth and perspective',
  Saturn: 'commitments and structure',
  Uranus: 'change and independence',
  Neptune: 'imagination and ideals',
  Pluto: 'deep change and renewal',
};

const aspectPrompts = {
  Conjunction: 'brings these themes close together, making them easier to notice.',
  Sextile: 'can open a useful opportunity when met with curiosity and effort.',
  Square: 'may highlight friction that invites a more considered response.',
  Trine: 'can make these themes feel more naturally in flow.',
  Opposition: 'may bring a contrast into view and invite a balance between both sides.',
};

function ayanamsaFor(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const centuries = (jd - 2451545) / 36525;
  return 23.853055 + 1.3969713 * centuries + 0.0003086 * centuries * centuries;
}

function localNoon(date) {
  const sample = new Date(date);
  sample.setHours(12, 0, 0, 0);
  return sample;
}

function transitSnapshot(chart, date) {
  const offset = chart.zodiacMode === 'sidereal' ? ayanamsaFor(date) : 0;
  const longitudes = getPlanetaryLongitudes(date);
  const planets = movingBodies.map((name) => {
    const longitude = ((longitudes[name] - offset) % 360 + 360) % 360;
    return {
      name,
      longitude,
      sign: zodiacPosition(longitude).sign,
      house: houseForLongitude(longitude, chart.houseCusps),
    };
  });
  const contacts = [];

  for (const transit of planets) {
    for (const natal of chart.placements) {
      const separation = Math.abs(((transit.longitude - natal.longitude + 540) % 360) - 180);
      const orbLimit = ['Sun', 'Moon'].includes(transit.name) ? 4 : 3;
      const match = aspects
        .map((aspect) => ({ ...aspect, orb: Math.abs(separation - aspect.angle) }))
        .filter((aspect) => aspect.orb <= orbLimit)
        .sort((left, right) => left.orb - right.orb)[0];
      if (match) contacts.push({ ...match, transit, natal });
    }
  }

  return { planets, contacts };
}

function houseFocus(chart, houseNumber, names, sampleCount = 1) {
  const house = houses[houseNumber - 1];
  return {
    number: houseNumber,
    title: house.title,
    description: house.description,
    planets: [...new Set(names)],
    sampleCount,
  };
}

function readingForContact(contact, date) {
  return {
    key: `${contact.transit.name}-${contact.name}-${contact.natal.name}`,
    transitName: contact.transit.name,
    natalName: contact.natal.name,
    aspectName: contact.name,
    symbol: contact.symbol,
    orb: contact.orb,
    date,
    house: contact.transit.house,
    text: `${contact.transit.name} highlights ${transitThemes[contact.transit.name]}, while your natal ${contact.natal.name} speaks to ${contact.natal.theme.toLowerCase()}. This ${contact.name.toLowerCase()} ${aspectPrompts[contact.name]}`,
  };
}

export function dailyReading(chart, date = new Date()) {
  const snapshot = transitSnapshot(chart, date);
  const houseNames = new Map();
  for (const planet of snapshot.planets) {
    if (!houseNames.has(planet.house)) houseNames.set(planet.house, []);
    houseNames.get(planet.house).push(planet.name);
  }
  const focus = [...houseNames.entries()]
    .map(([number, names]) => houseFocus(chart, number, names))
    .sort((left, right) => right.planets.length - left.planets.length)
    .slice(0, 3);
  const contacts = snapshot.contacts
    .sort((left, right) => left.orb - right.orb)
    .slice(0, 6)
    .map((contact) => readingForContact(contact, date));

  return { date, focus, contacts };
}

export function weeklyReading(chart, startDate = new Date()) {
  const samples = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    const sampleDate = index === 0 ? new Date(startDate) : localNoon(date);
    return { date, snapshot: transitSnapshot(chart, sampleDate) };
  });
  const houseSamples = new Map();
  const contactBest = new Map();

  for (const { date, snapshot } of samples) {
    const seenHouses = new Set(snapshot.planets.map((planet) => planet.house));
    for (const number of seenHouses) {
      const names = snapshot.planets.filter((planet) => planet.house === number).map((planet) => planet.name);
      const current = houseSamples.get(number) || { names: new Set(), sampleCount: 0 };
      names.forEach((name) => current.names.add(name));
      current.sampleCount += 1;
      houseSamples.set(number, current);
    }
    for (const contact of snapshot.contacts) {
      const key = `${contact.transit.name}-${contact.name}-${contact.natal.name}`;
      const previous = contactBest.get(key);
      if (!previous || contact.orb < previous.contact.orb) contactBest.set(key, { contact, date });
    }
  }

  const focus = [...houseSamples.entries()]
    .map(([number, value]) => houseFocus(chart, number, [...value.names], value.sampleCount))
    .sort((left, right) => right.sampleCount - left.sampleCount || right.planets.length - left.planets.length)
    .slice(0, 3);
  const contacts = [...contactBest.values()]
    .sort((left, right) => left.contact.orb - right.contact.orb)
    .slice(0, 8)
    .map(({ contact, date }) => readingForContact(contact, date));

  return {
    startDate: new Date(startDate),
    endDate: samples[samples.length - 1].date,
    focus,
    contacts,
  };
}
