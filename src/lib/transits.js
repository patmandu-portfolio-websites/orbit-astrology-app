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

const houseGuidance = [
  {
    explanation: 'This area is about how you show up: your sense of self, first impressions, and the way you approach something new. It is less about becoming a different person and more about noticing how you want to participate.',
    everyday: 'Introducing yourself, starting a personal project, or deciding how clearly to express a preference.',
    prompt: 'What would help me show up in a way that feels genuine?',
  },
  {
    explanation: 'This area brings together what you have and what you value. That includes practical resources, but also your skills, time, and sense of worth—not just money or possessions.',
    everyday: 'Reviewing how you spend your time, appreciating a skill, or noticing which commitments feel worth the effort.',
    prompt: 'What resource or ability could I look after more thoughtfully?',
  },
  {
    explanation: 'This area concerns everyday learning and exchange: how you ask questions, share information, and connect with people nearby. Small conversations can be useful opportunities to understand one another.',
    everyday: 'Writing a message, learning a practical skill, checking a misunderstanding, or catching up with a sibling or neighbor.',
    prompt: 'What question or conversation could bring a little more clarity?',
  },
  {
    explanation: 'This area is about your private foundations: home, belonging, family, and the places or people that help you feel settled. Home can mean emotional safety as well as a physical space.',
    everyday: 'Making your space more comfortable, taking a quiet evening, or reflecting on a family habit you want to keep or change.',
    prompt: 'What helps me feel supported and at home in my life?',
  },
  {
    explanation: 'This area makes room for enjoyment and self-expression. Creativity does not have to mean art or performance; it can be any activity where you play, experiment, or bring something of yourself.',
    everyday: 'Trying a hobby, making something just for fun, planning a playful outing, or giving an idea room to develop.',
    prompt: 'What could I enjoy without needing it to be productive or perfect?',
  },
  {
    explanation: 'This area concerns the rhythms that make daily life workable: routines, everyday tasks, and useful contribution. It invites attention to sustainable habits, not a prediction about your health.',
    everyday: 'Simplifying a to-do list, sharing a recurring task, or making space for a regular break.',
    prompt: 'What small adjustment would make my everyday rhythm easier to maintain?',
  },
  {
    explanation: 'This area is about one-to-one relationships, including partners, close collaborators, and agreements. It asks how two people can make room for both sets of needs rather than assuming one person should do all the adapting.',
    everyday: 'Checking expectations with a partner, listening to a different viewpoint, or clarifying who is responsible for what.',
    prompt: 'Where would a clearer conversation or a fairer agreement help?',
  },
  {
    explanation: 'This area concerns what is shared: trust, intimacy, responsibilities, and resources held with others. It can also be a lens on adjusting to change, with room for privacy and personal boundaries.',
    everyday: 'Clarifying a shared commitment, naming a boundary, or having a careful conversation about trust when both people are ready.',
    prompt: 'What would make a shared situation feel clearer or more respectful?',
  },
  {
    explanation: 'This area is about widening your perspective through learning, exploration, and questions of meaning. You do not need to travel far; encountering an unfamiliar idea can also broaden your outlook.',
    everyday: 'Reading about another perspective, taking a class, exploring somewhere new, or reconsidering a long-held assumption.',
    prompt: 'What am I curious to understand beyond my usual point of view?',
  },
  {
    explanation: 'This area concerns direction, responsibility, and the contribution you make beyond your private life. It can include career, but also roles in a family or community and what meaningful progress looks like to you.',
    everyday: 'Reviewing a longer-term goal, preparing for a responsibility, or noticing a contribution you are proud of.',
    prompt: 'What next step would support a direction that matters to me?',
  },
  {
    explanation: 'This area is about friendship, groups, and hopes for the future. It invites reflection on belonging and shared purpose, including whether the communities you spend time with support your values.',
    everyday: 'Checking in with a friend, joining a shared activity, or contributing a small idea to a group project.',
    prompt: 'Which connections help me feel included and able to contribute?',
  },
  {
    explanation: 'This area makes room for the quieter side of life: solitude, reflection, rest, and bringing things to a close. It is not a warning about hidden problems; it can simply be a prompt to pause.',
    everyday: 'Taking a screen-free moment, journaling, setting aside unfinished work for the evening, or allowing time to decompress.',
    prompt: 'What could I gently set down so I have more room to rest or reflect?',
  },
];

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

function houseFocus(houseNumber, names, sampleCount = 1) {
  const house = houses[houseNumber - 1];
  const planets = [...new Set(names)];
  return {
    number: houseNumber,
    title: house.title,
    description: house.description,
    ...houseGuidance[houseNumber - 1],
    planets,
    planetaryThemes: planets.map((name) => `${name}: ${transitThemes[name]}`),
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
    .map(([number, names]) => houseFocus(number, names))
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
    .map(([number, value]) => houseFocus(number, [...value.names], value.sampleCount))
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
